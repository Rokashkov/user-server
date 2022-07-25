declare namespace NodeJS {
	interface ProcessEnv {
		PORT: number

		DATABASE_URL: string

		API_DOMAIN: string
		CLIENT_DOMAIN: string

		SMTP_HOST: string
		SMTP_USER: string
		SMTP_PASSWORD: string
		SMTP_PORT: number

		JWT_ACCESS_SECRET: string
		JWT_REFRESH_SECRET: string
	}
}