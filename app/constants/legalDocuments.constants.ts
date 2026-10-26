export type LegalDocumentSection = {
	id: string;
	title: string;
	paragraphs?: string[];
	items?: string[];
	links?: Array<{
		label: string;
		href: string;
	}>;
};

export type LegalDocument = {
	title: string;
	metaTitle: string;
	metaDescription: string;
	lastUpdated: string;
	introduction: string[];
	sections: LegalDocumentSection[];
};

type SupportedLegalLocale = 'en' | 'pt';

type LocalizedLegalDocuments = Record<SupportedLegalLocale, LegalDocument>;

export const privacyPolicyDocuments: LocalizedLegalDocuments = {
	en: {
		title: 'Privacy Policy',
		metaTitle: 'Privacy Policy | Drunk Flavor',
		metaDescription:
			'Learn how Drunk Flavor collects, uses, stores, and protects personal data.',
		lastUpdated: 'Last updated: October 26, 2026',
		introduction: [
			'This Privacy Policy explains how Drunk Flavor processes personal data when you visit drunkflavor.com, create an account, sign in with Google, or use our drink recipe and community features.',
			'Drunk Flavor is operated by Juan Lessa, an individual established in Portugal. For the purposes of the General Data Protection Regulation (GDPR), Juan Lessa is the controller of the personal data described in this Policy.'
		],
		sections: [
			{
				id: 'contact',
				title: '1. Controller and contact',
				paragraphs: [
					'Questions, privacy requests, and requests to exercise data protection rights may be sent to the address below.'
				],
				links: [
					{ label: 'privacy@drunkflavor.com', href: 'mailto:privacy@drunkflavor.com' }
				]
			},
			{
				id: 'data-we-process',
				title: '2. Personal data we process',
				items: [
					'Account data: name, surname, email address, email verification status, account role and status, account creation and update dates, and a securely hashed version of your password. We do not store your password in readable form.',
					'Google sign-in data: when you choose Continue with Google, we receive an identity token and basic account information made available by Google, such as your Google account identifier, name, email address, email verification status, and profile image, as applicable.',
					'Community and service activity: ratings, comments, recipes or other catalog content you are authorized to submit, uploaded drink images, and associated timestamps and internal identifiers.',
					'Communications: information contained in messages you send to our support, privacy, or legal contact addresses.',
					'Technical and security data: IP address, browser and device information, request metadata, session identifiers, security events, error information, and server logs that may be generated when you use the service.',
					'Preferences: language preference stored in a cookie and theme preference stored in your browser.'
				]
			},
			{
				id: 'sources',
				title: '3. Where the data comes from',
				paragraphs: [
					'We receive data directly from you, automatically from your browser or device when you use the service, and from Google when you choose Google sign-in. Google processes information under its own privacy terms when providing that service.'
				],
				links: [
					{ label: 'Google Privacy Policy', href: 'https://policies.google.com/privacy' }
				]
			},
			{
				id: 'purposes-and-legal-bases',
				title: '4. Purposes and legal bases',
				items: [
					'Performance of a contract or steps requested before entering a contract: creating and administering your account, authenticating you, providing recipes and community features, processing ratings and comments, and responding to service requests.',
					'Legitimate interests: securing and maintaining the service, preventing fraud and abuse, diagnosing errors, enforcing our Terms, protecting users and our rights, and understanding aggregate service performance. We balance these interests against your rights and expectations.',
					'Legal obligations: retaining or disclosing information when required by applicable law, a binding legal request, or the establishment, exercise, or defense of legal claims.',
					'Consent: where applicable law requires consent for a specific optional feature or storage technology. You may withdraw consent at any time without affecting processing that occurred before withdrawal.'
				]
			},
			{
				id: 'cookies',
				title: '5. Cookies and browser storage',
				paragraphs: [
					'Drunk Flavor currently uses storage technologies needed to operate the service and remember your choices. We do not currently use advertising or analytics cookies.'
				],
				items: [
					'Authentication cookies keep you signed in and help protect your session. Authentication cookies are configured with security protections such as Secure and HttpOnly where applicable and may remain valid for up to 30 days unless you sign out or they are invalidated sooner.',
					'The i18n_redirected cookie remembers your language selection.',
					'Browser storage may remember your light or dark theme preference.'
				]
			},
			{
				id: 'sharing',
				title: '6. How we share personal data',
				paragraphs: [
					'We do not sell or rent personal data. We disclose only what is reasonably necessary to operate, secure, and comply with legal requirements for the service.'
				],
				items: [
					'Service providers supporting hosting, databases, caching and queues, transactional email, object or image storage, security, and technical operations.',
					'Google, when you initiate Google sign-in. Google acts under its own terms for its part of the authentication process.',
					'Authorities, courts, advisers, or other parties when disclosure is legally required or reasonably necessary to protect rights, safety, and service integrity.',
					'A successor or transaction participant if the service is reorganized, transferred, or acquired, subject to applicable confidentiality and data protection requirements.'
				]
			},
			{
				id: 'international-transfers',
				title: '7. International transfers',
				paragraphs: [
					'Some service providers may process data outside Portugal or the European Economic Area. Where the GDPR requires it, transfers will rely on an adequacy decision or appropriate safeguards, such as approved standard contractual clauses, together with supplementary safeguards where necessary.'
				]
			},
			{
				id: 'retention',
				title: '8. Retention and account deletion',
				paragraphs: [
					'We retain personal data only for as long as needed for the purposes described above, including operating your account, maintaining security, resolving disputes, and meeting legal obligations. The exact period depends on the type of data and why it is processed.',
					'When you delete your account, the active account record, credentials, linked sign-in identities, and account tokens are removed. Ratings or comments may remain to preserve the integrity of community content, associated only with an internal identifier that no longer resolves to an active account. You may contact us if you want those contributions reviewed for erasure. Limited information may remain temporarily in backups, security records, or records required by law until the relevant retention period expires.'
				]
			},
			{
				id: 'rights',
				title: '9. Your data protection rights',
				paragraphs: [
					'Subject to applicable law, you may request access, correction, erasure, restriction, portability, or a copy of your personal data, and may object to processing based on legitimate interests. Where processing is based on consent, you may withdraw that consent. We may need to verify your identity before fulfilling a request.',
					'You may also lodge a complaint with the Portuguese supervisory authority, the Comissão Nacional de Proteção de Dados (CNPD), or with the competent authority in the country where you live or work. If Brazilian data protection law applies to a particular processing activity, eligible individuals may also exercise the rights provided by the Lei Geral de Proteção de Dados (LGPD).'
				],
				links: [
					{ label: 'Email a privacy request', href: 'mailto:privacy@drunkflavor.com' },
					{
						label: 'Portuguese Data Protection Authority (CNPD)',
						href: 'https://www.cnpd.pt/'
					}
				]
			},
			{
				id: 'automated-decisions',
				title: '10. Automated decision-making',
				paragraphs: [
					'Drunk Flavor does not currently use personal data to make decisions based solely on automated processing that produce legal or similarly significant effects.'
				]
			},
			{
				id: 'security',
				title: '11. Security',
				paragraphs: [
					'We use reasonable technical and organizational measures designed to protect personal data, including encrypted transport, protected authentication cookies, password hashing, access controls, and limited-lifetime authentication and verification tokens. No internet service can guarantee absolute security.'
				]
			},
			{
				id: 'children',
				title: '12. Children and age restrictions',
				paragraphs: [
					'The service is intended only for people who are at least 18 years old or have reached the legal drinking age where they live, whichever is higher. We do not knowingly collect personal data from anyone who does not meet this requirement. Contact us if you believe an ineligible minor has provided personal data.'
				]
			},
			{
				id: 'changes',
				title: '13. Changes to this Policy',
				paragraphs: [
					'We may update this Policy to reflect changes to the service, our practices, or applicable law. We will publish the updated version here and change the last updated date. Where required, we will provide additional notice or request consent.'
				]
			}
		]
	},
	pt: {
		title: 'Política de Privacidade',
		metaTitle: 'Política de Privacidade | Drunk Flavor',
		metaDescription:
			'Saiba como o Drunk Flavor coleta, utiliza, armazena e protege dados pessoais.',
		lastUpdated: 'Última atualização: 26 de outubro de 2026',
		introduction: [
			'Esta Política de Privacidade explica como o Drunk Flavor trata dados pessoais quando você visita drunkflavor.com, cria uma conta, entra com o Google ou utiliza nossos recursos de receitas e comunidade.',
			'O Drunk Flavor é operado por Juan Lessa, pessoa singular estabelecida em Portugal. Para os efeitos do Regulamento Geral sobre a Proteção de Dados (RGPD), Juan Lessa é o responsável pelo tratamento dos dados pessoais descritos nesta Política.'
		],
		sections: [
			{
				id: 'contact',
				title: '1. Responsável e contato',
				paragraphs: [
					'Dúvidas, solicitações de privacidade e pedidos para exercer direitos de proteção de dados podem ser enviados para o endereço abaixo.'
				],
				links: [
					{ label: 'privacy@drunkflavor.com', href: 'mailto:privacy@drunkflavor.com' }
				]
			},
			{
				id: 'data-we-process',
				title: '2. Dados pessoais tratados',
				items: [
					'Dados da conta: nome, sobrenome, endereço de email, estado de verificação do email, função e estado da conta, datas de criação e atualização e uma versão da senha protegida por hash. Não armazenamos sua senha de forma legível.',
					'Dados do login com Google: quando você escolhe Continuar com Google, recebemos um token de identidade e informações básicas disponibilizadas pelo Google, como identificador da conta Google, nome, email, estado de verificação do email e imagem de perfil, quando aplicável.',
					'Atividade na comunidade e no serviço: avaliações, comentários, receitas ou outros conteúdos de catálogo que você esteja autorizado a enviar, imagens de drinks e respectivos horários e identificadores internos.',
					'Comunicações: informações contidas nas mensagens enviadas aos nossos endereços de suporte, privacidade ou assuntos legais.',
					'Dados técnicos e de segurança: endereço IP, informações de navegador e dispositivo, metadados das requisições, identificadores de sessão, eventos de segurança, informações de erros e logs do servidor que podem ser gerados durante o uso.',
					'Preferências: idioma armazenado em cookie e preferência de tema armazenada no navegador.'
				]
			},
			{
				id: 'sources',
				title: '3. Origem dos dados',
				paragraphs: [
					'Recebemos dados diretamente de você, automaticamente do navegador ou dispositivo durante o uso e do Google quando você escolhe o login com Google. O Google trata informações conforme seus próprios termos de privacidade ao prestar esse serviço.'
				],
				links: [
					{
						label: 'Política de Privacidade do Google',
						href: 'https://policies.google.com/privacy'
					}
				]
			},
			{
				id: 'purposes-and-legal-bases',
				title: '4. Finalidades e bases legais',
				items: [
					'Execução de contrato ou diligências pré-contratuais solicitadas: criar e administrar sua conta, autenticar você, disponibilizar receitas e recursos da comunidade, processar avaliações e comentários e responder a solicitações sobre o serviço.',
					'Interesses legítimos: proteger e manter o serviço, prevenir fraude e abuso, diagnosticar erros, aplicar nossos Termos, proteger usuários e nossos direitos e compreender o desempenho agregado do serviço. Ponderamos esses interesses em relação aos seus direitos e expectativas.',
					'Obrigações legais: conservar ou divulgar informações quando exigido pela lei aplicável, por solicitação legal vinculativa ou para constituição, exercício ou defesa de direitos em processos.',
					'Consentimento: quando a lei aplicável exigir consentimento para determinado recurso opcional ou tecnologia de armazenamento. Você pode retirar o consentimento a qualquer momento, sem afetar tratamentos anteriores à retirada.'
				]
			},
			{
				id: 'cookies',
				title: '5. Cookies e armazenamento no navegador',
				paragraphs: [
					'O Drunk Flavor utiliza atualmente tecnologias necessárias para operar o serviço e lembrar suas escolhas. Atualmente não utilizamos cookies de publicidade ou análise.'
				],
				items: [
					'Cookies de autenticação mantêm sua sessão e ajudam a protegê-la. Eles são configurados com proteções como Secure e HttpOnly, quando aplicáveis, e podem permanecer válidos por até 30 dias, salvo se você sair da conta ou forem invalidados antes.',
					'O cookie i18n_redirected lembra sua seleção de idioma.',
					'O armazenamento do navegador pode lembrar sua preferência entre tema claro e escuro.'
				]
			},
			{
				id: 'sharing',
				title: '6. Compartilhamento de dados pessoais',
				paragraphs: [
					'Não vendemos nem alugamos dados pessoais. Divulgamos somente o que for razoavelmente necessário para operar e proteger o serviço e cumprir obrigações legais.'
				],
				items: [
					'Prestadores que oferecem hospedagem, bancos de dados, cache e filas, emails transacionais, armazenamento de objetos ou imagens, segurança e operações técnicas.',
					'Google, quando você inicia o login com Google. O Google atua sob seus próprios termos na parte do processo de autenticação que fornece.',
					'Autoridades, tribunais, consultores ou outras partes quando a divulgação for legalmente exigida ou razoavelmente necessária para proteger direitos, segurança e integridade do serviço.',
					'Um sucessor ou participante de transação caso o serviço seja reorganizado, transferido ou adquirido, sujeito a requisitos aplicáveis de confidencialidade e proteção de dados.'
				]
			},
			{
				id: 'international-transfers',
				title: '7. Transferências internacionais',
				paragraphs: [
					'Alguns prestadores podem tratar dados fora de Portugal ou do Espaço Econômico Europeu. Quando exigido pelo RGPD, as transferências serão baseadas em decisão de adequação ou garantias apropriadas, como cláusulas contratuais-tipo aprovadas, acompanhadas de medidas complementares quando necessário.'
				]
			},
			{
				id: 'retention',
				title: '8. Conservação e exclusão da conta',
				paragraphs: [
					'Conservamos dados pessoais somente pelo tempo necessário para as finalidades acima, incluindo operar sua conta, manter a segurança, resolver disputas e cumprir obrigações legais. O período exato depende do tipo de dado e do motivo do tratamento.',
					'Quando você exclui a conta, o registro ativo da conta, credenciais, identidades de login vinculadas e tokens da conta são removidos. Avaliações ou comentários podem permanecer para preservar a integridade do conteúdo da comunidade, associados apenas a um identificador interno que já não corresponde a uma conta ativa. Você pode nos contatar para solicitar a análise da exclusão dessas contribuições. Informações limitadas podem permanecer temporariamente em backups, registros de segurança ou registros exigidos por lei até o fim do respectivo prazo de conservação.'
				]
			},
			{
				id: 'rights',
				title: '9. Seus direitos de proteção de dados',
				paragraphs: [
					'Nos limites da lei aplicável, você pode solicitar acesso, correção, exclusão, limitação, portabilidade ou uma cópia dos dados pessoais e pode se opor a tratamentos baseados em interesses legítimos. Quando o tratamento depender de consentimento, você pode retirá-lo. Podemos precisar verificar sua identidade antes de atender a uma solicitação.',
					'Você também pode apresentar reclamação à autoridade portuguesa, a Comissão Nacional de Proteção de Dados (CNPD), ou à autoridade competente do país onde vive ou trabalha. Se a lei brasileira de proteção de dados for aplicável a determinada atividade, as pessoas elegíveis também poderão exercer os direitos previstos na Lei Geral de Proteção de Dados (LGPD).'
				],
				links: [
					{
						label: 'Enviar uma solicitação de privacidade',
						href: 'mailto:privacy@drunkflavor.com'
					},
					{
						label: 'Comissão Nacional de Proteção de Dados (CNPD)',
						href: 'https://www.cnpd.pt/'
					}
				]
			},
			{
				id: 'automated-decisions',
				title: '10. Decisões automatizadas',
				paragraphs: [
					'O Drunk Flavor atualmente não utiliza dados pessoais para tomar decisões exclusivamente automatizadas que produzam efeitos jurídicos ou de importância semelhante.'
				]
			},
			{
				id: 'security',
				title: '11. Segurança',
				paragraphs: [
					'Utilizamos medidas técnicas e organizacionais razoáveis destinadas a proteger dados pessoais, incluindo transporte criptografado, cookies de autenticação protegidos, hash de senhas, controles de acesso e tokens de autenticação e verificação com duração limitada. Nenhum serviço na internet pode garantir segurança absoluta.'
				]
			},
			{
				id: 'children',
				title: '12. Menores e restrições de idade',
				paragraphs: [
					'O serviço destina-se somente a pessoas com pelo menos 18 anos ou que tenham atingido a idade legal para consumir bebidas alcoólicas no local onde vivem, prevalecendo a maior. Não coletamos intencionalmente dados pessoais de quem não cumpra esse requisito. Entre em contato se acreditar que um menor não elegível forneceu dados pessoais.'
				]
			},
			{
				id: 'changes',
				title: '13. Alterações desta Política',
				paragraphs: [
					'Podemos atualizar esta Política para refletir mudanças no serviço, em nossas práticas ou na lei aplicável. Publicaremos a versão atualizada nesta página e alteraremos a data da última atualização. Quando exigido, forneceremos aviso adicional ou solicitaremos consentimento.'
				]
			}
		]
	}
};

export const termsOfServiceDocuments: LocalizedLegalDocuments = {
	en: {
		title: 'Terms of Service',
		metaTitle: 'Terms of Service | Drunk Flavor',
		metaDescription: 'Read the rules and conditions that apply when using Drunk Flavor.',
		lastUpdated: 'Last updated: October 26, 2026',
		introduction: [
			'These Terms of Service govern your access to and use of Drunk Flavor at drunkflavor.com. The service is operated by Juan Lessa, an individual established in Portugal.',
			'By accessing or using the service, you agree to these Terms. If you do not agree, do not use the service.'
		],
		sections: [
			{
				id: 'eligibility',
				title: '1. Eligibility and age requirement',
				paragraphs: [
					'You may use Drunk Flavor only if you are at least 18 years old or have reached the legal drinking age in your location, whichever is higher, and you have legal capacity to agree to these Terms. You are responsible for following the laws that apply where you live and use the service.'
				]
			},
			{
				id: 'service',
				title: '2. The service',
				paragraphs: [
					'Drunk Flavor is a free service for discovering and sharing information about drink recipes, ingredients, preparation methods, ratings, and related community content. Features may change, be suspended, or be discontinued. We do not promise that every feature or item of content will always be available.'
				]
			},
			{
				id: 'alcohol',
				title: '3. Alcohol and safety notice',
				paragraphs: [
					'Drink recipes and related content are provided for general informational and entertainment purposes. They are not medical, nutritional, or professional advice. Alcohol affects people differently and may present serious health and safety risks.'
				],
				items: [
					'Drink responsibly and comply with local age and alcohol laws.',
					'Do not drink and drive or operate machinery after consuming alcohol.',
					'Do not rely on a recipe to determine whether consumption is safe for you. Consider allergies, medication interactions, pregnancy, health conditions, and guidance from a qualified professional.',
					'Never provide alcohol to anyone below the applicable legal drinking age.'
				]
			},
			{
				id: 'accounts',
				title: '4. Accounts and authentication',
				items: [
					'Provide accurate information and keep it reasonably current.',
					'Keep your credentials secure and notify us promptly if you suspect unauthorized access.',
					'You are responsible for activity conducted through your account unless applicable law provides otherwise.',
					'You may authenticate through Google. Your use of Google services is also governed by Google’s applicable terms and privacy policy.',
					'Do not create accounts through automated means, impersonate another person, or transfer an account without permission.'
				]
			},
			{
				id: 'acceptable-use',
				title: '5. Acceptable use',
				paragraphs: ['You must not use Drunk Flavor to:'],
				items: [
					'Break the law, violate another person’s rights, or facilitate harmful or dangerous conduct.',
					'Encourage underage drinking, irresponsible alcohol consumption, violence, discrimination, harassment, or abuse.',
					'Post content that is unlawful, deceptive, defamatory, infringing, malicious, sexually exploitative, or invasive of privacy.',
					'Upload malware, probe or bypass security, disrupt the service, scrape it excessively, or access accounts or systems without authorization.',
					'Use the service to send spam, manipulate ratings, misrepresent affiliation, or engage in fraudulent activity.',
					'Copy or commercially exploit the service, its content, brand, or source code except where a separate written license expressly permits it.'
				]
			},
			{
				id: 'user-content',
				title: '6. User content',
				paragraphs: [
					'You retain ownership of content you submit, such as comments, ratings, recipes, translations, and images. You represent that you have the rights needed to submit that content and that it complies with these Terms.',
					'You grant Drunk Flavor a non-exclusive, worldwide, royalty-free license to host, store, reproduce, format, translate, display, and distribute your content only as reasonably necessary to operate, secure, improve, and present the service. This license ends when the content is deleted from active systems, except where continued retention is legally permitted or technically necessary for limited backups.',
					'We may remove, hide, or restrict content that violates these Terms, creates legal or safety risk, or harms the service. We are not required to publish or preserve user content.'
				]
			},
			{
				id: 'intellectual-property',
				title: '7. Intellectual property and source code',
				paragraphs: [
					'Drunk Flavor’s name, visual identity, software, site design, curated content, and other materials are protected by intellectual property laws. Except for the limited right to use the service under these Terms, no rights are transferred to you.',
					'Some source code may be publicly visible in a GitHub repository. Public visibility does not by itself grant permission to copy, modify, distribute, sublicense, or commercially exploit that code. A license file or other explicit written license in the relevant repository governs the files it covers. Where no separate license exists, all rights are reserved and commercial use requires prior written permission from Juan Lessa.'
				]
			},
			{
				id: 'third-parties',
				title: '8. Third-party services and links',
				paragraphs: [
					'The service may use or link to third-party services, including Google authentication. Third parties control their own services and terms. Drunk Flavor is not responsible for third-party content, availability, security, or privacy practices.'
				],
				links: [
					{ label: 'Google Terms of Service', href: 'https://policies.google.com/terms' },
					{ label: 'Google Privacy Policy', href: 'https://policies.google.com/privacy' }
				]
			},
			{
				id: 'availability',
				title: '9. Availability and changes',
				paragraphs: [
					'We may maintain, modify, restrict, or discontinue any part of the service. We aim to keep information useful and systems available, but we do not guarantee uninterrupted access, error-free operation, or the accuracy, completeness, safety, or suitability of every recipe or user contribution.'
				]
			},
			{
				id: 'termination',
				title: '10. Suspension, termination, and deletion',
				paragraphs: [
					'You may stop using the service and delete your account. We may suspend or terminate access when reasonably necessary to address a violation of these Terms, legal or security risk, abuse, or service discontinuation. Where appropriate, we will consider the nature and seriousness of the issue before taking action.',
					'Provisions that by their nature should continue after termination—including intellectual property, disclaimers, liability limits, and governing law—remain effective.'
				]
			},
			{
				id: 'disclaimers',
				title: '11. Disclaimers',
				paragraphs: [
					'To the maximum extent permitted by law, the service is provided “as is” and “as available,” without warranties that are not expressly stated in these Terms. Nothing in these Terms excludes statutory warranties or consumer rights that cannot lawfully be excluded.'
				]
			},
			{
				id: 'liability',
				title: '12. Limitation of liability',
				paragraphs: [
					'To the maximum extent permitted by law, Drunk Flavor and Juan Lessa will not be liable for indirect, incidental, special, consequential, or purely economic losses arising from use of or inability to use the service. Nothing in these Terms limits liability where limitation is prohibited, including liability for fraud, willful misconduct, death or personal injury caused by negligence, or mandatory consumer rights.'
				]
			},
			{
				id: 'privacy',
				title: '13. Privacy',
				paragraphs: ['Our Privacy Policy explains how personal data is processed.'],
				links: [{ label: 'Read the Privacy Policy', href: '/privacy' }]
			},
			{
				id: 'law',
				title: '14. Governing law and disputes',
				paragraphs: [
					'These Terms are governed by the laws of Portugal, without prejudice to mandatory protections available under the law of your country of residence. Disputes are subject to the competent courts of Portugal unless applicable consumer law gives you the right to bring proceedings in another court.'
				]
			},
			{
				id: 'changes-and-contact',
				title: '15. Changes and contact',
				paragraphs: [
					'We may update these Terms when the service or applicable requirements change. We will publish the revised version and update the date above. Material changes will receive additional notice where required. Continued use after the effective date of revised Terms constitutes acceptance only to the extent permitted by law.',
					'Questions about these Terms may be sent to:'
				],
				links: [{ label: 'legal@drunkflavor.com', href: 'mailto:legal@drunkflavor.com' }]
			}
		]
	},
	pt: {
		title: 'Termos de Serviço',
		metaTitle: 'Termos de Serviço | Drunk Flavor',
		metaDescription: 'Consulte as regras e condições aplicáveis ao uso do Drunk Flavor.',
		lastUpdated: 'Última atualização: 26 de outubro de 2026',
		introduction: [
			'Estes Termos de Serviço regem o acesso e uso do Drunk Flavor em drunkflavor.com. O serviço é operado por Juan Lessa, pessoa singular estabelecida em Portugal.',
			'Ao acessar ou utilizar o serviço, você concorda com estes Termos. Se não concordar, não utilize o serviço.'
		],
		sections: [
			{
				id: 'eligibility',
				title: '1. Elegibilidade e idade mínima',
				paragraphs: [
					'Você somente pode utilizar o Drunk Flavor se tiver pelo menos 18 anos ou atingido a idade legal para consumir bebidas alcoólicas em seu local, prevalecendo a maior, e tiver capacidade legal para aceitar estes Termos. Você é responsável por cumprir as leis aplicáveis onde vive e utiliza o serviço.'
				]
			},
			{
				id: 'service',
				title: '2. O serviço',
				paragraphs: [
					'O Drunk Flavor é um serviço gratuito para descobrir e compartilhar informações sobre receitas de drinks, ingredientes, modos de preparo, avaliações e conteúdo relacionado da comunidade. Os recursos podem ser alterados, suspensos ou encerrados. Não prometemos que todos os recursos ou conteúdos estarão sempre disponíveis.'
				]
			},
			{
				id: 'alcohol',
				title: '3. Aviso sobre álcool e segurança',
				paragraphs: [
					'Receitas de drinks e conteúdos relacionados são fornecidos para fins gerais de informação e entretenimento. Não constituem aconselhamento médico, nutricional ou profissional. O álcool afeta cada pessoa de maneira diferente e pode apresentar riscos graves à saúde e à segurança.'
				],
				items: [
					'Beba com responsabilidade e cumpra as leis locais sobre idade e bebidas alcoólicas.',
					'Não dirija nem opere máquinas após consumir álcool.',
					'Não utilize uma receita para determinar se o consumo é seguro para você. Considere alergias, interações com medicamentos, gravidez, condições de saúde e orientação de profissional qualificado.',
					'Nunca forneça álcool a quem não tenha atingido a idade legal aplicável.'
				]
			},
			{
				id: 'accounts',
				title: '4. Contas e autenticação',
				items: [
					'Forneça informações corretas e mantenha-as razoavelmente atualizadas.',
					'Mantenha suas credenciais seguras e nos avise prontamente se suspeitar de acesso não autorizado.',
					'Você é responsável pelas atividades realizadas por sua conta, salvo disposição diferente da lei aplicável.',
					'Você pode se autenticar pelo Google. Seu uso dos serviços Google também é regido pelos termos e pela política de privacidade aplicáveis do Google.',
					'Não crie contas por meios automatizados, não se passe por outra pessoa nem transfira uma conta sem permissão.'
				]
			},
			{
				id: 'acceptable-use',
				title: '5. Uso aceitável',
				paragraphs: ['Você não deve utilizar o Drunk Flavor para:'],
				items: [
					'Violar a lei ou direitos de terceiros ou facilitar condutas perigosas ou prejudiciais.',
					'Incentivar consumo de álcool por menores, consumo irresponsável, violência, discriminação, assédio ou abuso.',
					'Publicar conteúdo ilegal, enganoso, difamatório, infrator, malicioso, sexualmente exploratório ou invasivo da privacidade.',
					'Enviar malware, testar ou contornar a segurança, interromper o serviço, realizar coleta automatizada excessiva ou acessar contas ou sistemas sem autorização.',
					'Usar o serviço para enviar spam, manipular avaliações, alegar vínculo inexistente ou praticar fraude.',
					'Copiar ou explorar comercialmente o serviço, conteúdo, marca ou código-fonte, salvo quando uma licença escrita separada permitir expressamente.'
				]
			},
			{
				id: 'user-content',
				title: '6. Conteúdo do usuário',
				paragraphs: [
					'Você mantém a propriedade do conteúdo enviado, como comentários, avaliações, receitas, traduções e imagens. Você declara possuir os direitos necessários para enviar esse conteúdo e que ele respeita estes Termos.',
					'Você concede ao Drunk Flavor uma licença não exclusiva, mundial e gratuita para hospedar, armazenar, reproduzir, formatar, traduzir, exibir e distribuir seu conteúdo apenas na medida razoavelmente necessária para operar, proteger, melhorar e apresentar o serviço. Essa licença termina quando o conteúdo é excluído dos sistemas ativos, exceto quando a conservação for legalmente permitida ou tecnicamente necessária em backups limitados.',
					'Podemos remover, ocultar ou restringir conteúdo que viole estes Termos, gere risco jurídico ou de segurança ou prejudique o serviço. Não somos obrigados a publicar ou preservar conteúdo do usuário.'
				]
			},
			{
				id: 'intellectual-property',
				title: '7. Propriedade intelectual e código-fonte',
				paragraphs: [
					'O nome Drunk Flavor, sua identidade visual, software, design do site, conteúdo selecionado e outros materiais são protegidos por leis de propriedade intelectual. Além do direito limitado de utilizar o serviço conforme estes Termos, nenhum direito é transferido a você.',
					'Parte do código-fonte pode estar publicamente visível em um repositório no GitHub. A visibilidade pública não concede, por si só, permissão para copiar, modificar, distribuir, sublicenciar ou explorar comercialmente esse código. Um arquivo de licença ou outra licença escrita explícita no respectivo repositório rege os arquivos que ela abrange. Quando não houver licença separada, todos os direitos são reservados e o uso comercial exige autorização prévia e escrita de Juan Lessa.'
				]
			},
			{
				id: 'third-parties',
				title: '8. Serviços e links de terceiros',
				paragraphs: [
					'O serviço pode utilizar ou conter links para serviços de terceiros, incluindo a autenticação do Google. Terceiros controlam seus próprios serviços e termos. O Drunk Flavor não é responsável pelo conteúdo, disponibilidade, segurança ou práticas de privacidade de terceiros.'
				],
				links: [
					{
						label: 'Termos de Serviço do Google',
						href: 'https://policies.google.com/terms'
					},
					{
						label: 'Política de Privacidade do Google',
						href: 'https://policies.google.com/privacy'
					}
				]
			},
			{
				id: 'availability',
				title: '9. Disponibilidade e alterações',
				paragraphs: [
					'Podemos manter, modificar, restringir ou descontinuar qualquer parte do serviço. Procuramos manter informações úteis e sistemas disponíveis, mas não garantimos acesso ininterrupto, operação sem erros nem a exatidão, integralidade, segurança ou adequação de cada receita ou contribuição de usuário.'
				]
			},
			{
				id: 'termination',
				title: '10. Suspensão, encerramento e exclusão',
				paragraphs: [
					'Você pode deixar de usar o serviço e excluir sua conta. Podemos suspender ou encerrar o acesso quando razoavelmente necessário para responder a violação destes Termos, risco legal ou de segurança, abuso ou encerramento do serviço. Quando adequado, consideraremos a natureza e a gravidade do problema antes de agir.',
					'Disposições que, por sua natureza, devam continuar após o encerramento — incluindo propriedade intelectual, isenções, limites de responsabilidade e lei aplicável — permanecem vigentes.'
				]
			},
			{
				id: 'disclaimers',
				title: '11. Isenções',
				paragraphs: [
					'No limite máximo permitido por lei, o serviço é oferecido “no estado em que se encontra” e “conforme disponível”, sem garantias que não estejam expressamente previstas nestes Termos. Nada nestes Termos exclui garantias legais ou direitos do consumidor que não possam ser legalmente excluídos.'
				]
			},
			{
				id: 'liability',
				title: '12. Limitação de responsabilidade',
				paragraphs: [
					'No limite máximo permitido por lei, o Drunk Flavor e Juan Lessa não serão responsáveis por perdas indiretas, incidentais, especiais, consequenciais ou puramente econômicas decorrentes do uso ou impossibilidade de uso do serviço. Nada nestes Termos limita responsabilidade quando a limitação for proibida, inclusive por fraude, dolo, morte ou lesão pessoal causada por negligência ou direitos obrigatórios do consumidor.'
				]
			},
			{
				id: 'privacy',
				title: '13. Privacidade',
				paragraphs: [
					'Nossa Política de Privacidade explica como os dados pessoais são tratados.'
				],
				links: [{ label: 'Ler a Política de Privacidade', href: '/privacy' }]
			},
			{
				id: 'law',
				title: '14. Lei aplicável e disputas',
				paragraphs: [
					'Estes Termos são regidos pelas leis de Portugal, sem prejuízo das proteções obrigatórias disponíveis conforme a lei do seu país de residência. As disputas são submetidas aos tribunais competentes de Portugal, salvo quando a legislação do consumidor aplicável lhe conceder o direito de recorrer a outro tribunal.'
				]
			},
			{
				id: 'changes-and-contact',
				title: '15. Alterações e contato',
				paragraphs: [
					'Podemos atualizar estes Termos quando o serviço ou os requisitos aplicáveis mudarem. Publicaremos a versão revisada e atualizaremos a data acima. Alterações relevantes receberão aviso adicional quando exigido. O uso continuado após a vigência dos Termos revisados constitui aceitação somente na medida permitida por lei.',
					'Dúvidas sobre estes Termos podem ser enviadas para:'
				],
				links: [{ label: 'legal@drunkflavor.com', href: 'mailto:legal@drunkflavor.com' }]
			}
		]
	}
};
