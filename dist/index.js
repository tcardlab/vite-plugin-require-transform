"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = __importStar(require("@babel/parser"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const t = __importStar(require("@babel/types"));
function vitePluginRequireTransform(params = {}) {
    const { fileRegex = /.ts$|.tsx$/, importPrefix: prefix = '_vite_plugin_require_transform_', importPathHandler, exclude } = params;
    let importMap = new Map();
    let variableMather = {};
    let requirePathMatcher = {};
    return {
        name: prefix,
        async transform(code, id) {
            let newCode = code;
            if (fileRegex.test(id)) {
                let plugins = [];
                const ast = parser.parse(code, {
                    sourceType: "module",
                    plugins,
                });
                (0, traverse_1.default)(ast, {
                    enter(path) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                        if (path.isIdentifier({ name: 'require' }) && t.isCallExpression((_a = path === null || path === void 0 ? void 0 : path.parentPath) === null || _a === void 0 ? void 0 : _a.node)) {
                            let originalRequirePath = path.parentPath.node.arguments[0].value;
                            let requirePath = originalRequirePath;
                            if (exclude.test(requirePath)) {
                                return;
                            }
                            if (importPathHandler) {
                                requirePath = importPathHandler(requirePath);
                            }
                            else {
                                requirePath = requirePath.replace(/(.*\/)*([^.]+).*/ig, "$2").replace(/-/g, '_');
                            }
                            requirePathMatcher[requirePath] = originalRequirePath;
                            if (!importMap.has(requirePath)) {
                                importMap.set(requirePath, new Set());
                            }
                            if (t.isMemberExpression(path.parentPath.parentPath) && t.isIdentifier((_d = (_c = (_b = path === null || path === void 0 ? void 0 : path.parentPath) === null || _b === void 0 ? void 0 : _b.parentPath) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.property)) {
                                const requirePathExports = importMap.get(requirePath);
                                const property = (_g = (_f = (_e = path === null || path === void 0 ? void 0 : path.parentPath) === null || _e === void 0 ? void 0 : _e.parentPath) === null || _f === void 0 ? void 0 : _f.node) === null || _g === void 0 ? void 0 : _g.property;
                                const currentExport = property === null || property === void 0 ? void 0 : property.name;
                                if (requirePathExports) {
                                    requirePathExports.add(currentExport);
                                    importMap.set(requirePath, requirePathExports);
                                    path.parentPath.parentPath.replaceWithSourceString(prefix + requirePath + "_" + currentExport);
                                }
                            }
                            else {
                                path.parentPath.replaceWithSourceString(prefix + requirePath);
                                if (t.isVariableDeclarator((_j = (_h = path.parentPath) === null || _h === void 0 ? void 0 : _h.parentPath) === null || _j === void 0 ? void 0 : _j.node)) {
                                    const variableDeclarator = (_l = (_k = path.parentPath) === null || _k === void 0 ? void 0 : _k.parentPath) === null || _l === void 0 ? void 0 : _l.node;
                                    variableMather[variableDeclarator.id.name] = requirePath;
                                }
                                if (t.isConditionalExpression((_o = (_m = path.parentPath) === null || _m === void 0 ? void 0 : _m.parentPath) === null || _o === void 0 ? void 0 : _o.node) && t.isVariableDeclarator((_r = (_q = (_p = path === null || path === void 0 ? void 0 : path.parentPath) === null || _p === void 0 ? void 0 : _p.parentPath) === null || _q === void 0 ? void 0 : _q.parentPath) === null || _r === void 0 ? void 0 : _r.node)) {
                                    const variableDeclarator = (_u = (_t = (_s = path.parentPath) === null || _s === void 0 ? void 0 : _s.parentPath) === null || _t === void 0 ? void 0 : _t.parentPath) === null || _u === void 0 ? void 0 : _u.node;
                                    variableMather[variableDeclarator.id.name] = requirePath;
                                }
                            }
                        }
                        const isRawMethodCheck = (currentExport) => {
                            return Object.prototype.toString.call(new Array()[currentExport]).includes("Function") || Object.prototype.toString.call(new Object()[currentExport]).includes("Function");
                        };
                        if (t.isIdentifier(path.node) && variableMather[(_v = path.node) === null || _v === void 0 ? void 0 : _v.name]) {
                            const requirePath = variableMather[path.node.name];
                            const requirePathExports = importMap.get(requirePath);
                            const currentExport = (_x = (_w = path.parentPath.node) === null || _w === void 0 ? void 0 : _w.property) === null || _x === void 0 ? void 0 : _x.name;
                            if (currentExport && !isRawMethodCheck(currentExport) && requirePathExports)
                                requirePathExports.add(currentExport);
                        }
                    }
                });
                for (const importItem of importMap.entries()) {
                    let originalPath = requirePathMatcher[importItem[0]];
                    let requireSpecifier = importItem[0];
                    if (importPathHandler) {
                        requireSpecifier = importPathHandler(requireSpecifier);
                    }
                    else {
                        requireSpecifier = requireSpecifier.replace(/(.*\/)*([^.]+).*/ig, "$2").replace(/-/g, '_');
                    }
                    if (importItem[1].size) {
                        const importSpecifiers = [];
                        for (const item of importItem[1].values()) {
                            item && importSpecifiers.push(t.importSpecifier(t.identifier(prefix + requireSpecifier + "_" + item), t.identifier(item)));
                        }
                        const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(originalPath));
                        ast.program.body.unshift(importDeclaration);
                    }
                    else {
                        const importDefaultSpecifier = [t.importDefaultSpecifier(t.identifier(prefix + requireSpecifier))];
                        const importDeclaration = t.importDeclaration(importDefaultSpecifier, t.stringLiteral(originalPath));
                        ast.program.body.unshift(importDeclaration);
                    }
                }
                const statementList = [];
                for (const requirePath of Object.values(variableMather)) {
                    const importExports = importMap.get(requirePath);
                    if (importExports === null || importExports === void 0 ? void 0 : importExports.size) {
                        const idIdentifier = t.identifier(prefix + requirePath);
                        const properties = [];
                        for (const currentExport of importExports === null || importExports === void 0 ? void 0 : importExports.values()) {
                            properties.push(t.objectProperty(t.identifier(currentExport), t.identifier(prefix + requirePath + "_" + currentExport)));
                        }
                        const initObjectExpression = t.objectExpression(properties);
                        statementList.push(t.variableDeclaration('const', [t.variableDeclarator(idIdentifier, initObjectExpression)]));
                    }
                }
                const index = ast.program.body.findIndex((value) => {
                    return !t.isImportDeclaration(value);
                });
                ast.program.body.splice(index, 0, ...statementList);
                const output = (0, generator_1.default)(ast);
                newCode = output.code;
            }
            importMap = new Map();
            variableMather = {};
            return { code: newCode };
        },
    };
}
exports.default = vitePluginRequireTransform;
//# sourceMappingURL=index.js.map