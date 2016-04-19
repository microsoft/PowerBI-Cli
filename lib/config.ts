import * as fs from 'fs';
import * as _ from 'lodash'

const filePath: string = '.powerbirc';

export class Config {
    /**
     * Gets the saved configuration values
     */
    public static get(): any {
        if (!fs.existsSync(filePath)) {
            return {};
        }

        let configFileRaw = fs.readFileSync(filePath, { encoding: 'utf8' });
        return configFileRaw ? JSON.parse(configFileRaw) : {};
    }

    /**
     * Stores the configuration values
     */
    public static set(settings): void {
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 4));
    }

    public static merge(settings): any {
        return _.merge(Config.get(), settings);
    }
}