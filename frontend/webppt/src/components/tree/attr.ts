import * as tree from '@/components/tree';
import * as key from '@/api/key';

const arrayTip = 'Array should be wrapped between "[" and "]" in JSON format';
const mapTip = 'Map should be wrapped between "{" and "}" in JSON format';
const undefinedTypeTip = 'Undefined type should be in JSON format';

export default class Attribute implements tree.Node<key.Key, string|number|boolean|undefined> {
    public readonly id: number = Math.random();
    public readonly k: tree.KV<key.Key>;
    public v: tree.KV<string|number|boolean|undefined>;
    public locked?: boolean;
    constructor(kw: key.Key, v: any) {
        let tip = key.tip(kw);
        this.k = {
            value: kw,
            tooltip: tip,
            url: `#/key?filter=_id%3D%27${kw.ID}%27&limit=1`,
            fmt(): string {
                return key.fmtNames(this.value);
            },
        };
        if (kw.Res.Vals !== null && kw.Res.Vals.length > 0) {
            this.v = {
                value: v,
                options: kw.Res.Vals.map((it) => ({label: it.toString(), value: it})),
                tooltip: tip,
                editor: tree.KV_EDITOR_SELECT,
            };
        } else {
            switch (kw.Type) {
                case key.ValueType.Bool:
                    this.v = {
                        value: v,
                        options: [
                            {label: 'false', value: false},
                            {label: 'true', value: true},
                        ],
                        tooltip: tip,
                        editor: tree.KV_EDITOR_SELECT,
                    };
                    break;
                case key.ValueType.Int: // TODO: int should have more constraint than float
                case key.ValueType.Float:
                    this.v = {
                        value: v,
                        min: kw.Res.Min !== null ? kw.Res.Min : -Infinity,
                        max: kw.Res.Max !== null ? kw.Res.Max : Infinity,
                        placeholder: tip,
                        tooltip: tip,
                        editor: tree.KV_EDITOR_INPUT_NUMBER,
                    };
                    break;
                case key.ValueType.Array:
                    if (v !== void 0) {
                        v = JSON.stringify(v);
                    }
                    tip += '; ' + arrayTip;
                    this.v = {
                        value: v,
                        placeholder: tip,
                        tooltip: tip,
                        editor: tree.KV_EDITOR_INPUT,
                    };
                    break;
                case key.ValueType.Map:
                    if (v !== void 0) {
                        v = JSON.stringify(v);
                    }
                    tip += '; ' + mapTip;
                    this.v = {
                        value: v,
                        placeholder: tip,
                        tooltip: tip,
                        editor: tree.KV_EDITOR_INPUT,
                    };
                    break;
                case key.ValueType.Undefine:
                    if (v !== void 0) {
                        v = JSON.stringify(v);
                    }
                    tip += '; ' + undefinedTypeTip;
                    this.v = {
                        value: v,
                        placeholder: tip,
                        tooltip: tip,
                        editor: tree.KV_EDITOR_INPUT,
                    };
                    break;
                default:
                    this.v = {
                        value: v,
                        placeholder: tip,
                        editor: tree.KV_EDITOR_INPUT,
                    };
                    break;
            }
        }
        // if value is not undefined, locked by default
        this.locked = this.v.value === void 0 ? void 0 : true;
    }

    public del(): void {
        this.v.value = void 0;
        this.locked = void 0;
    }

    public canDelete(): boolean {
        return this.v.value !== void 0;
    }

    public setLock(lock: boolean): void {
        if (this.canLocked()) {
            this.locked = lock;
        }
    }

    public getLock(): boolean|undefined|null {
        // new value should be locked as default
        if (this.canLocked() && this.locked === void 0) {
            this.locked = true;
        }
        return this.locked;
    }

    public getUnlockedAttrs(): string[] {
        return this.locked === false ? [this.k.value.ID] : [];
    }

    // according to key's value type to convert value
    public getValue(): any {
        let v = this.v.value;
        switch (this.k.value.Type) {
            case key.ValueType.Undefine:
                if (typeof(v) === 'string') {
                    v = v.trim();
                    try {
                        return JSON.parse(v);
                    } catch (e) {
                        throw this.newValidationErr(e);
                    }
                }
                break;
            case key.ValueType.Array:
                if (typeof(v) === 'string') {
                    v = v.trim();
                    if (v.length < 2 || (v[0] !== '[' && v[v.length - 1] !== ']')) {
                        throw this.newValidationErr(arrayTip);
                    }
                    try {
                        return JSON.parse(v);
                    } catch (e) {
                        throw this.newValidationErr(e);
                    }
                }
                break;
            case key.ValueType.Map:
                if (typeof(v) === 'string') {
                    v = v.trim();
                    if (v.length < 2 || (v[0] !== '{' && v[v.length - 1] !== '}')) {
                        throw this.newValidationErr(mapTip);
                    }
                    try {
                        return JSON.parse(v);
                    } catch (e) {
                        throw this.newValidationErr(e);
                    }
                }
                break;
            default:
                break;
        }
        return v;
    }

    private canLocked(): boolean {
        return this.canDelete();
    }

    private newValidationErr(e: any): Error {
        return new Error(`Fail to validate attribute ${key.fmtFullNames(this.k.value)}, reason: ${e}`);
    }
}
