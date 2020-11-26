import { User } from '../models/User';
import nodemailer from 'nodemailer';
import htmlToText from 'html-to-text';
import { confirmAccountTemplate, passwordRecoveryTemplate } from '../utils';

const {
	NODE_ENV,
	EMAIL_FROM,
	MAIL_HOST,
	HOST_USERNAME,
	HOST_PASSWORD,
} = process.env;

class Email {
	to: string;
	firstName: string;
	url: string;
	from: string;
	constructor(userData: User, url: string) {
		this.to = userData.email;
		this.firstName = userData.firstName;
		this.url = url;
		this.from = `Ayodele Kayode <${EMAIL_FROM}>`;
	}

	newTransport() {
		if (NODE_ENV === 'production') {
			// ZOHO
			return nodemailer.createTransport({
				service: MAIL_HOST,
				secure: true,
				auth: {
					user: HOST_USERNAME,
					pass: HOST_PASSWORD,
				},
			});
		}
		return nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: '85ee7fdf36847d',
				pass: '90c70b20f6e692',
			},
		});
	}

	async send(template: string, subject: string): Promise<void> {
		// send the actual email
		const html = template;

		//define the email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html),
		};

		//CREATE A TRANSPORT AND SEND EMAIL
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome(): Promise<void> {
		const html = confirmAccountTemplate(this.firstName, this.url);
		await this.send(html, 'Welcome to hotel booking api app!');
	}

	async sendPasswordReset(): Promise<void> {
		const html = passwordRecoveryTemplate(this.firstName, this.url);
		await this.send(
			html,
			'Your password reset token (valid for only 10 minutes)'
		);
	}
}

export default Email;
