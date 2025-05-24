import { AppError } from "@designr/api-errors"

/** 
 * @description promise-catch gives a unified way for handling server action errors and passing it to the client and sentry
 */
type CatchResult = {
    message: string;
    statusCode: number;
    type: 'error';
}
const promiseCatch = async<T>(promise: Promise<T>): Promise<T | CatchResult | undefined> => {
    return new Promise<T>((resolve, reject) => {
        promise
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    }).catch((error) => {
        if (error instanceof AppError) {
            console.error(error.getErrorLogMessage());
            return {
                message: error.message,
                statusCode: error.statusCode,
                type: 'error',
            }
        }
    })
}
export {
    promiseCatch
};
export type { CatchResult };
