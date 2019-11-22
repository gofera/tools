import {ElMessageOptions} from 'element-ui/types/message';
import {AxiosRequestConfig} from 'axios';
import axios from 'axios';
import * as moment from 'moment';

export enum RespCode {
    OK,
    NoAuth,
    AuthFail,
    NoPermission,
    FailToParseBody,
    DbErr,
    NotExist,
    FailToGenToken,
    FailToGenAttr,
    FailToGenAttrAndUpdateState,
}

export interface Resp {
    Code: RespCode;
    Content: any;
}

export function isTokenExpired(r: Resp): boolean {
    return r.Code === RespCode.AuthFail && r.Content === 'Token is expired';
}

export function formatResp(r: Resp): string {
    switch (r.Code) {
        case RespCode.OK:
            return 'Success';
        case RespCode.NoAuth:
            return 'Fail as no authorization';
        case RespCode.AuthFail:
            if (isTokenExpired(r)) {
                return 'Fail as login is out-dated, please re-login';
            } else {
                return `Fail to authorization, reason: ${r.Content}`;
            }
        case RespCode.NoPermission:
            return `No permission, required permission is ${formatPermission(r.Content)}`;
        case RespCode.FailToParseBody:
            return `Fail to parse request body, reason: ${r.Content}`;
        case RespCode.DbErr:
            return `Database error, reason: ${r.Content}`;
        case RespCode.NotExist:
            return `Not exist`;
        case RespCode.FailToGenToken:
            return `Fail to generate token, reason: ${r.Content}`;
        case RespCode.FailToGenAttr:
            return `Fail to generate attributes, reason: ${r.Content}`;
        case RespCode.FailToGenAttrAndUpdateState:
            return `Fail to generate attributes and update state in DB, reason: ${r.Content}`;
        default:
            return `Fail with unknown code: ${r.Code} and reason: ${r.Content}`;
    }
}

// prefix: the prefix in the message
export function getRespMessage(r: Resp, prefix?: string): ElMessageOptions {
    let msg = formatResp(r);
    if (prefix) {
        msg = prefix + ' ' + msg;
    }
    return {
        message: msg,
        type: r.Code === RespCode.OK ? 'success' : 'error',
        offset: 150,
        showClose: true,
    };
}

export enum Permission {
    Viewer,
    Editor,
    Admin,
}

export function formatPermission(p: Permission): string {
    switch (p) {
        case Permission.Admin:
            return 'Admin';
        case Permission.Editor:
            return 'Editor';
        default:
            return 'Viewer';
    }
}

export interface User {
    ID: string;
    Email: string;
    Permission: Permission;
}

export function getNullUser(): User {
    return {
        ID: '',
        Email: '',
        Permission: Permission.Viewer,
    };
}

function header(token: string): any {
    return {
        headers: {
            'Content-Type': 'application/json',
            'auth': token,
        },
    };
}

function mergeToken(token?: string, config?: AxiosRequestConfig): AxiosRequestConfig|undefined {
    if (token) {
        const h = header(token);
        if (config) {
            config = (Object as any).assign(config, h);
        } else {
            config = h;
        }
    }
    return config;
}

export function post<T>(url: string, data?: any, token?: string, config?: AxiosRequestConfig): Promise<T> {
    config = mergeToken(token, config);
    // @ts-ignore
    return new Promise<T>((resolve, reject) => {
        axios.post(url, data, config)
            .then((res) => resolve(res.data))
            .catch((e) => reject(e));
    });
}

export function put<T>(url: string, data?: any, token?: string, config?: AxiosRequestConfig): Promise<T> {
    config = mergeToken(token, config);
    // @ts-ignore
    return new Promise<T>((resolve, reject) => {
        axios.put(url, data, config)
            .then((res) => resolve(res.data))
            .catch((e) => reject(e));
    });
}

export function del<T>(url: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
    config = mergeToken(token, config);
    // @ts-ignore
    return new Promise<T>((resolve, reject) => {
        axios.delete(url, config)
            .then((res) => resolve(res.data))
            .catch((e) => reject(e));
    });
}

export function get<T>(url: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
    config = mergeToken(token, config);
    // @ts-ignore
    return new Promise<T>((resolve, reject) => {
        axios.get(url, config)
            .then((res) => resolve(res.data))
            .catch((e) => reject(e));
    });
}

export interface FindOpt {
    filter?: string;
    projections?: string;
    limit?: number;
    skip?: number;
    sortkey?: string;
    desc?: boolean;
    returntotal?: boolean;
}

export function formatTime(time: string): string {
    return moment.unix(parseInt(time.substr(0, time.length - 9), 10)).format('YYYY-MM-DD HH:mm:ss');
}

export function isNullOrUndefined(o: any): boolean {
    return o === undefined || o === null;
}

export interface UserAndTime {
    User: string;
    Time: string;
}

export function nullUserAndTime(): UserAndTime {
    return {
        User: '',
        Time: '0',
    };
}

export enum Status {
    DONE, PENDING, ERR_GEN_ATTR, ERR_SAVE_ATTR,
}

export function toStringForStatus(s: Status): string {
    switch (s) {
        case Status.DONE:
            return 'OK';
        case Status.PENDING:
            return 'Pending';
        default:
            return 'Error';
    }
}

export function formatStatus(s: Status): string {
    return 'Status ' + toStringForStatus(s);
}

export interface PathLoc {
    Path: string;
    Loc: Location;
}

export function nullPathLoc(): PathLoc {
    return {
        Path: '',
        Loc: Location.LocBUS,
    };
}

export enum Location {
    LocUndefined, LocBC, LocBUS,
}

export function fmtLocation(l: Location): string {
    switch (l) {
        case Location.LocUndefined:
            return '';
        case Location.LocBC:
            return 'BC';
        case Location.LocBUS:
            return 'BUS';
        default:
            return `Unknown Location ${l}`;
    }
}

export function toPathLoc(path: string): PathLoc {
    if (path.endsWith('(BC)')) {
        return {
            Path: path.substr(0, path.length - '(BC)'.length).trim(),
            Loc: Location.LocBC,
        };
    } else if (path.endsWith('(BUS)')) {
        return {
            Path: path.substr(0, path.length - '(BUS)'.length).trim(),
            Loc: Location.LocBUS,
        };
    } else {
        return {
            Path: path.trim(),
            Loc: Location.LocUndefined,
        };
    }
}

export function toPathLocs(paths: string[]): PathLoc[] {
    const mps: PathLoc[] = [];
    for (const p of paths) {
        mps.push(toPathLoc(p));
    }
    return mps;
}

export function toPath(p: PathLoc): string {
    const path = p.Path.trim();
    if (path === '') {
        return '';
    }
    switch (p.Loc) {
        case Location.LocBC:
            if (!path.endsWith('(BC)')) {
                return path + ' (BC)';
            }
            break;
        case Location.LocBUS:
            if (!path.endsWith('(BUS)')) {
                return path + ' (BUS)';
            }
            break;
        default:
            break;
    }
    return path;
}

export function toPaths(mps: PathLoc[]): string[] {
    const ps: string[] = [];
    for (const p of mps) {
        ps.push(toPath(p));
    }
    return ps;
}
