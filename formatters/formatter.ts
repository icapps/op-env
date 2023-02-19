import { OutputFileFormat } from 'types';
import { formatDartValues } from './dart.formatter';
import { formatEnvValues } from './env.formatter.';

export function formatValues(params: {
    values: Record<string, string>;
    secrets?: Record<string, string>;
    format: OutputFileFormat;
    environment?: string;
}) {
    const { values, secrets, format, environment } = params;
    switch (format) {
        case 'dart':
            return formatDartValues(values);
        case 'env':
            return formatEnvValues({ values, secrets, environment });
        default: {
            console.error('Output format not supported');
            return undefined;
        }
    }
}
