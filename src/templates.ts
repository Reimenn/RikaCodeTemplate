import { applyFilter } from "./filters";
import * as vscode from "vscode";
import { id } from "./extension";

// eslint-disable-next-line @typescript-eslint/naming-convention
type renderFunction = (groups: Array<string>) => string;
const templateSlotRegexp = /{!(.*?)!}/g;


export class Template {
    language: RegExp;
    regex: RegExp;
    template: string | renderFunction;

    constructor(language: RegExp, regex: RegExp, template: string | renderFunction) {
        this.language = language;
        this.regex = regex;
        this.template = template;
    }
    /**
     * 匹配一段内容。
     * @param source 要被匹配的内容
     * @returns 匹配到的结果，若返回 null 表示没有匹配到内容或模板生成器不是字符串。
     */
    match(source: string): string[] | null {
        if (typeof this.template === "string") {
            return this.regex.exec(source);
        }
        return null;
    }
    /**
     * 使用参数生成最终结果。
     * @param args 参数列表。
     * @returns 生成好的模板结果。
     */
    render(args: string[]): string {
        let template = this.template;
        if (typeof template === "function") {
            return template(args);
        }
        let templateSplitList = template.split(templateSlotRegexp);
        let result = "";
        for (let i = 0; i < templateSplitList.length; i++) {
            let item = templateSplitList[i];
            if (i % 2 !== 0) {
                // in slot
                try {
                    let itemSplitList = item.split(" ");
                    let name = itemSplitList[0];
                    let ind = parseInt(name);
                    let source = args[ind];
                    if (!source) {
                        continue;
                    }
                    source = applyFilter(source, ...(itemSplitList.slice(1)));
                    result += source;
                } catch (e) {
                    continue;
                }
            } else {
                // out slot
                result += item;
            }
        }
        return result;
    }
}

export let templates: Array<Template> = [];

/**
 * 从配置文件读取模板.
 */
export function reloadTemplates() {
    templates = [];
    let config = loadTemplatesConfig();
    for (let i = 0; i < config.length; i++) {
        let item = config[i];
        try {
            if (item.template instanceof Array) {
                item.template = item.template.join("\n");
            }
            templates.push(new Template(
                new RegExp(item.language),
                new RegExp(item.regex),
                item.template
            ));
        } catch (e) {
            continue;
        }
    }
}

export interface ITemplateConfig {
    language: RegExp;
    regex: RegExp;
    template: string | string[];
}
export function loadTemplatesConfig(): ITemplateConfig[] {
    let res = vscode.workspace.getConfiguration(id).get<Array<ITemplateConfig>>("templates");
    if (res) {
        return res;
    }
    return [];
}