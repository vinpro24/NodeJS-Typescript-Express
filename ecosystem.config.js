/*
 * @Author: VinPro
 * @Last Modified by: VinPro
 * @Last Modified time: 2019-12-22 16:54:06
 * @Copyright © 2023 VinPro. All rights reserved
 */

module.exports = {
    apps: [
        {
            name: 'api',
            script: './index.js',
            merge_logs: true,
            max_restarts: 200,
            instances: 4,
            max_memory_restart: '200M'
        }
    ]
}
