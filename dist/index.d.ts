export declare type VitePluginRequireTransformParamsType = {
    fileRegex?: RegExp;
    importPrefix?: string;
    importPathHandler?: Function;
    exclude?: RegExp;
};
export default function vitePluginRequireTransform(params?: VitePluginRequireTransformParamsType): {
    name: string;
    transform(code: string, id: string): Promise<{
        code: string;
    }>;
};
//# sourceMappingURL=index.d.ts.map