import type { ConnectionInfo } from '@prisma/driver-adapter-utils';
import type { IsolationLevel } from '@prisma/driver-adapter-utils';
import * as mariadb from 'mariadb';
import type { SqlDriverAdapter } from '@prisma/driver-adapter-utils';
import type { SqlDriverAdapterFactory } from '@prisma/driver-adapter-utils';
import type { SqlQuery } from '@prisma/driver-adapter-utils';
import type { SqlQueryable } from '@prisma/driver-adapter-utils';
import type { SqlResultSet } from '@prisma/driver-adapter-utils';
import type { Transaction } from '@prisma/driver-adapter-utils';

declare type ArrayModeResult = unknown[][] & {
    meta?: mariadb.FieldInfo[];
    affectedRows?: number;
    insertId?: BigInt;
};

declare type Capabilities = {
    supportsRelationJoins: boolean;
};

declare class MariaDbQueryable<Connection extends mariadb.Pool | mariadb.Connection> implements SqlQueryable {
    protected client: Connection;
    readonly provider = "mysql";
    readonly adapterName: string;
    constructor(client: Connection);
    queryRaw(query: SqlQuery): Promise<SqlResultSet>;
    executeRaw(query: SqlQuery): Promise<number>;
    protected performIO(query: SqlQuery): Promise<ArrayModeResult>;
    protected onError(error: unknown): never;
}

export declare class PrismaMariaDb implements SqlDriverAdapterFactory {
    #private;
    readonly provider = "mysql";
    readonly adapterName: string;
    constructor(config: mariadb.PoolConfig | string, options?: PrismaMariadbOptions);
    connect(): Promise<PrismaMariaDbAdapter>;
}

declare class PrismaMariaDbAdapter extends MariaDbQueryable<mariadb.Pool> implements SqlDriverAdapter {
    private readonly capabilities;
    private readonly options?;
    constructor(client: mariadb.Pool, capabilities: Capabilities, options?: PrismaMariadbOptions | undefined);
    executeScript(_script: string): Promise<void>;
    getConnectionInfo(): ConnectionInfo;
    startTransaction(isolationLevel?: IsolationLevel): Promise<Transaction>;
    dispose(): Promise<void>;
    underlyingDriver(): mariadb.Pool;
}

declare type PrismaMariadbOptions = {
    database?: string;
    onConnectionError?: (err: mariadb.SqlError) => void;
};

export { }
