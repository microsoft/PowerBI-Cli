'use strict';

import * as fs from 'fs';
import * as _ from 'lodash'

export module Config {
    const filePath: string = '.powerbirc';

    /**
     * Gets the saved configuration values
     */
    export function get() {
        if (!fs.existsSync(filePath)) {
            return {};
        }

        let configFileRaw = fs.readFileSync(filePath, { encoding: 'utf8' });
        return configFileRaw ? JSON.parse(configFileRaw) : {};
    }

    /**
     * Stores the configuration values
     */
    export function set(settings) {
        fs.writeFileSync(filePath, JSON.stringify(settings));
    }
    
    export function merge(settings){
        return _.merge(get(), settings);
    }
}