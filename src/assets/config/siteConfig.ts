interface MetaTag {
	name: string;
	content: string;
}

interface SiteConfig {
	title: string;
	tagline?: string;
	metaTags?: MetaTag[];
	favicon?: {
		href: string;
		type?: string;
	};
}

export const siteConfig: SiteConfig = {
	title: 'App Marketplace',
	tagline: 'All the apps and integrations that you need',
	metaTags: [
		{ name: 'author', content: 'OpenChannel' },
		{ name: 'description', content: 'OpenChannel' },
		{ name: 'generator', content: 'OpenChannel' },
	],
	favicon: {
		href: 'assets/img/favicon.png',
		type: 'image/x-icon'
	},
};
