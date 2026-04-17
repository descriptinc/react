/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  HIRFunction,
  Identifier,
  IdentifierId,
  Instruction,
  Place,
  isReactiveType,
  isUseEffectEventType,
  isUseEffectHookType,
  isUseInsertionEffectHookType,
  isUseLayoutEffectHookType,
  makeType,
} from '../HIR/HIR';
import {BuiltInNonReactiveId} from '../HIR/ObjectShape';
import {eachInstructionValueOperand} from '../HIR/visitors';

/**
 * Usage-based inference of non-reactive function identities.
 *
 * For each `FunctionExpression` defined within the component, determines
 * whether every use of the resulting function flows only into "safe"
 * consumers (JSX attributes and effect-hook arguments). If so, the
 * function's aliased identifiers are mutated to carry the
 * `BuiltInNonReactive` function shape, which causes
 * `markNonReactiveScopes` to wrap the enclosing scope in the two-slot
 * stable-identity codegen pattern.
 *
 * Bails out if the function (or any alias) is:
 *   - called directly (used as the callee of a CallExpression)
 *   - passed to any non-effect hook (useMemo, useCallback, useState, ...)
 *   - stored in an object/array (escapes where we can't audit use)
 *   - returned from the component
 *   - captured by another function we can't follow
 *   - flows through a context variable
 *   - explicitly annotated as `Reactive<T>` on its declaring StoreLocal
 */
export function inferNonReactiveHandlers(fn: HIRFunction): void {
  if (
    !fn.env.config.enableInferNonReactiveHandlers ||
    !fn.env.config.enableNonReactiveAnnotation
  ) {
    return;
  }

  const functionRoots: Array<IdentifierId> = [];
  const identifierById: Map<IdentifierId, Identifier> = new Map();

  for (const [, block] of fn.body.blocks) {
    for (const phi of block.phis) {
      identifierById.set(phi.place.identifier.id, phi.place.identifier);
    }
    for (const instr of block.instructions) {
      identifierById.set(instr.lvalue.identifier.id, instr.lvalue.identifier);
      for (const operand of eachInstructionValueOperand(instr.value)) {
        identifierById.set(operand.identifier.id, operand.identifier);
      }
      if (instr.value.kind === 'FunctionExpression') {
        functionRoots.push(instr.lvalue.identifier.id);
      }
      if (instr.value.kind === 'StoreLocal') {
        identifierById.set(
          instr.value.lvalue.place.identifier.id,
          instr.value.lvalue.place.identifier,
        );
      }
    }
  }
  if (functionRoots.length === 0) {
    return;
  }

  for (const rootId of functionRoots) {
    const aliases = collectAliases(fn, rootId, identifierById);
    if (aliases == null) {
      continue;
    }
    if (isExplicitlyReactive(aliases, identifierById)) {
      continue;
    }
    if (!allUsesAreSafe(fn, aliases)) {
      continue;
    }
    for (const id of aliases) {
      const identifier = identifierById.get(id);
      if (identifier == null) {
        continue;
      }
      const existing = identifier.type;
      const returnType =
        existing.kind === 'Function' ? existing.return : makeType();
      identifier.type = {
        kind: 'Function',
        shapeId: BuiltInNonReactiveId,
        return: returnType,
        isConstructor: false,
      };
    }
  }
}

function collectAliases(
  fn: HIRFunction,
  rootId: IdentifierId,
  identifierById: Map<IdentifierId, Identifier>,
): Set<IdentifierId> | null {
  const aliases = new Set<IdentifierId>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [, block] of fn.body.blocks) {
      for (const phi of block.phis) {
        let anyAlias = false;
        for (const [, operand] of phi.operands) {
          if (aliases.has(operand.identifier.id)) {
            anyAlias = true;
            break;
          }
        }
        if (anyAlias && !aliases.has(phi.place.identifier.id)) {
          aliases.add(phi.place.identifier.id);
          identifierById.set(phi.place.identifier.id, phi.place.identifier);
          changed = true;
        }
      }
      for (const instr of block.instructions) {
        const {value, lvalue} = instr;
        if (
          value.kind === 'LoadLocal' &&
          aliases.has(value.place.identifier.id) &&
          !aliases.has(lvalue.identifier.id)
        ) {
          aliases.add(lvalue.identifier.id);
          changed = true;
        } else if (value.kind === 'StoreLocal') {
          if (aliases.has(value.value.identifier.id)) {
            const lvalId = value.lvalue.place.identifier.id;
            if (!aliases.has(lvalId)) {
              aliases.add(lvalId);
              changed = true;
            }
            if (!aliases.has(lvalue.identifier.id)) {
              aliases.add(lvalue.identifier.id);
              changed = true;
            }
          }
        } else if (
          value.kind === 'StoreContext' ||
          value.kind === 'LoadContext' ||
          value.kind === 'DeclareContext'
        ) {
          for (const operand of eachInstructionValueOperand(value)) {
            if (aliases.has(operand.identifier.id)) {
              return null;
            }
          }
        }
      }
    }
  }
  return aliases;
}

function isExplicitlyReactive(
  aliases: Set<IdentifierId>,
  identifierById: Map<IdentifierId, Identifier>,
): boolean {
  for (const id of aliases) {
    const identifier = identifierById.get(id);
    if (identifier != null && isReactiveType(identifier)) {
      return true;
    }
  }
  return false;
}

function allUsesAreSafe(
  fn: HIRFunction,
  aliases: Set<IdentifierId>,
): boolean {
  for (const [, block] of fn.body.blocks) {
    for (const instr of block.instructions) {
      if (!isInstructionUseSafe(instr, aliases)) {
        return false;
      }
    }
    const terminal = block.terminal;
    if (terminal.kind === 'return') {
      if (aliases.has(terminal.value.identifier.id)) {
        return false;
      }
    }
  }
  return true;
}

function isInstructionUseSafe(
  instr: Instruction,
  aliases: Set<IdentifierId>,
): boolean {
  const {value} = instr;
  switch (value.kind) {
    case 'FunctionExpression':
    case 'ObjectMethod': {
      for (const ctx of value.loweredFunc.func.context) {
        if (aliases.has(ctx.identifier.id)) {
          return false;
        }
      }
      return true;
    }
    case 'LoadLocal':
    case 'StoreLocal': {
      return true;
    }
    case 'JsxExpression': {
      for (const prop of value.props) {
        if (prop.kind === 'JsxSpreadAttribute') {
          if (aliases.has(prop.argument.identifier.id)) {
            return false;
          }
        }
      }
      return true;
    }
    case 'CallExpression': {
      if (aliases.has(value.callee.identifier.id)) {
        return false;
      }
      const isEffectHook =
        isUseEffectHookType(value.callee.identifier) ||
        isUseLayoutEffectHookType(value.callee.identifier) ||
        isUseInsertionEffectHookType(value.callee.identifier) ||
        isUseEffectEventType(value.callee.identifier);
      if (!isEffectHook) {
        for (const arg of value.args) {
          const place: Place = arg.kind === 'Identifier' ? arg : arg.place;
          if (aliases.has(place.identifier.id)) {
            return false;
          }
        }
      }
      return true;
    }
    case 'MethodCall': {
      if (aliases.has(value.property.identifier.id)) {
        return false;
      }
      for (const arg of value.args) {
        const place: Place = arg.kind === 'Identifier' ? arg : arg.place;
        if (aliases.has(place.identifier.id)) {
          return false;
        }
      }
      return true;
    }
    default: {
      for (const operand of eachInstructionValueOperand(value)) {
        if (aliases.has(operand.identifier.id)) {
          return false;
        }
      }
      return true;
    }
  }
}
