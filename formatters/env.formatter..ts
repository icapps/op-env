type OutputFile = { filename: string; content: string };

export function formatEnvValues(params: {
    values: Record<string, string>;
    secrets?: Record<string, string>;
    environment?: string;
    location?: string;
}): OutputFile[] {
    const { values, secrets, environment } = params;
    const files: OutputFile[] = [];

    // Create .env<.environment> file with all plain values
    files.push({
        filename: `.env${environment ? `.${environment}` : ''}`,
        content: Object.keys(values)
            .map((key) => `${key}=${values[key]}`)
            .join('\n'),
    });

    // Create .env.secrets<.environment> file with all references to 1password entries
    if (secrets)
        files.push({
            filename: `.env.secret${environment ? `.${environment}` : ''}`,
            content: Object.keys(secrets)
                .map((key) => `${key}=${secrets[key]}`)
                .join('\n'),
        });

    return files;
}
