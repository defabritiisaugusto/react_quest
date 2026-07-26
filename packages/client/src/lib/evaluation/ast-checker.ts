import * as parser from '@babel/parser';
import type { Node } from '@babel/types';

type ASTCheckResult = { passed: boolean; message?: string };

function parse(code: string) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
}

function walk(node: Node, visitor: (node: Node) => void) {
  visitor(node);
  for (const key of Object.keys(node)) {
    const child = (node as any)[key];
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) {
        child.forEach((c) => {
          if (c && typeof c.type === 'string') walk(c, visitor);
        });
      } else if (typeof child.type === 'string') {
        walk(child, visitor);
      }
    }
  }
}

export function hasImport(code: string, args: { source: string; specifier?: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'ImportDeclaration' && node.source.value === args.source) {
        if (!args.specifier) {
          found = true;
        } else {
          found = node.specifiers.some(
            (s) =>
              (s.type === 'ImportSpecifier' && s.imported.type === 'Identifier' && s.imported.name === args.specifier) ||
              (s.type === 'ImportDefaultSpecifier' && args.specifier === 'default'),
          );
        }
      }
    });
    return { passed: found, message: found ? undefined : `Missing import of '${args.specifier || args.source}' from '${args.source}'` };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function hasCallExpression(code: string, args: { callee: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier' && node.callee.name === args.callee) {
          found = true;
        }
      }
    });
    return { passed: found, message: found ? undefined : `Expected call to '${args.callee}' not found` };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function hasJSXElement(code: string, args: { element: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'JSXOpeningElement') {
        if (node.name.type === 'JSXIdentifier' && node.name.name === args.element) {
          found = true;
        }
      }
    });
    return { passed: found, message: found ? undefined : `Expected JSX element '<${args.element}>' not found` };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function hasHookCall(code: string, args: { hook: string }): ASTCheckResult {
  return hasCallExpression(code, { callee: args.hook });
}

export function hasExportDefault(code: string): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'ExportDefaultDeclaration') found = true;
    });
    return { passed: found, message: found ? undefined : 'Expected a default export' };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function hasFunctionComponent(code: string, args: { name?: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'FunctionDeclaration' && node.id) {
        if (!args.name || node.id.name === args.name) {
          const hasReturn = hasJSXReturn(node);
          if (hasReturn) found = true;
        }
      }
      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
        if (!args.name || node.id.name === args.name) {
          if (node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
            found = true;
          }
        }
      }
    });
    return { passed: found, message: found ? undefined : `Expected function component${args.name ? ` '${args.name}'` : ''} not found` };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

function hasJSXReturn(node: Node): boolean {
  let found = false;
  walk(node, (child) => {
    if (child.type === 'ReturnStatement' && child.argument) {
      if (child.argument.type === 'JSXElement' || child.argument.type === 'JSXFragment') {
        found = true;
      }
      if (child.argument.type === 'ParenthesizedExpression') {
        walk(child.argument, (inner) => {
          if (inner.type === 'JSXElement' || inner.type === 'JSXFragment') found = true;
        });
      }
    }
  });
  return found;
}

export function hasProps(code: string, args: { component?: string; prop: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (node.type === 'JSXAttribute' && node.name.type === 'JSXIdentifier' && node.name.name === args.prop) {
        found = true;
      }
    });
    return { passed: found, message: found ? undefined : `Expected prop '${args.prop}' not found` };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function hasArrayMap(code: string): ASTCheckResult {
  try {
    const ast = parse(code);
    let found = false;
    walk(ast.program, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'map'
      ) {
        found = true;
      }
    });
    return { passed: found, message: found ? undefined : 'Expected .map() call not found' };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export function noDirectMutation(code: string, args: { variable: string }): ASTCheckResult {
  try {
    const ast = parse(code);
    let mutated = false;
    walk(ast.program, (node) => {
      if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier' && node.left.name === args.variable) {
        mutated = true;
      }
      if (node.type === 'UpdateExpression' && node.argument.type === 'Identifier' && node.argument.name === args.variable) {
        mutated = true;
      }
    });
    return { passed: !mutated, message: mutated ? `Direct mutation of '${args.variable}' detected — use setState instead` : undefined };
  } catch (e: any) {
    return { passed: false, message: `Parse error: ${e.message}` };
  }
}

export const AST_CHECKS: Record<string, (code: string, args: any) => ASTCheckResult> = {
  hasImport,
  hasCallExpression,
  hasJSXElement,
  hasHookCall,
  hasExportDefault,
  hasFunctionComponent,
  hasProps,
  hasArrayMap,
  noDirectMutation,
};
