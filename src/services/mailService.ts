import nodemailer from 'nodemailer'

class MailService {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		}
	})

	async sendActivationMail (email: string, activationLink: string): Promise<void> {
		const message = {
			from: process.env.SMTP_USER,
			to: email,
			subject: `Подтверждение регистрации на ${ process.env.CLIENT_DOMAIN }`,
			html: `
				<h1>Подтверждение регистрации на ${ process.env.CLIENT_DOMAIN }</h1>
				<p>Для подтверждения регистрации на сайте перейдите по ссылке:</p>
				<a href="${ activationLink }">${ activationLink }</a>
			`
		}
		this.transporter.sendMail(message, (err) => {
			if (err) {
				throw err
			}
		})
	}
}

export default new MailService