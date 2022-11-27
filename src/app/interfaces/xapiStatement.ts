export interface XapiStatement {
    actionId?: string,

    createdBy?: string,
    createdAt?: string,
    updatedBy?: string,
    updatedAt?: string,

    verb: {
        type: 'join' | 'complete',
        progress?: number
    },
    actor: {
        userId: string,
    },
    object: {
        objectId: string,
    }
}