import fs from 'fs';

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            try {
                fs.writeFileSync("last_error.txt", err.stack + "\n" + JSON.stringify(err, null, 2));
            } catch (e) {}
            next(err);
        });
    }
}


export default asyncHandler;