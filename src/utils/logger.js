class Logger {
    constructor(moduleName, subModuleName = null) {
        this.moduleName = subModuleName === null ? moduleName : moduleName + "/" + subModuleName;
        this.commonTypes = ["number", "string"];
        this.endCharacters = [".", "!", "?", ":"];
        this.environment = process.env.NODE_ENV;
    }

    log(...args) {
        // if(this.environment !== 'production' && this.environment !== 'prod'){

        // In case you want to log an object
        if (args.length === 1 && !this.commonTypes.includes(typeof args[0])) {
            console.log(args[0]);
        } else {
            const errors = [];
            let message = `[${this.moduleName}] -`;
            for (let i = 0; i < args.length; i++) {
                message += " " + args[i];
                if (args[i] instanceof Error) {
                    errors.push(args[i]);
                }
            }

            if (!this.endCharacters.includes(message.charAt(message.length - 1))) {
                message += ".";
            }
            console.log(message);
            while (errors.length > 0) {
                console.error(errors.shift());
            }
        }

        // }
    }
}

export default Logger;
