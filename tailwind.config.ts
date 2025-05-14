
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				recipe: {
					blue: '#04a118', // Primary green color
					orange: '#fb923c',
					green: '#59a52c', // Secondary green color
					yellow: '#facc15',
                    purple: '#9b87f5', // Purple color for servings
                    teal: '#14b8a6', // Teal color for cuisine
                    amber: '#d97706',  // Amber color for dietary
                    primaryPurple: '#9b87f5', // Primary Purple
                    secondaryPurple: '#7E69AB', // Secondary Purple  
                    tertiaryPurple: '#6E59A5', // Tertiary Purple
                    darkPurple: '#1A1F2C' // Dark Purple
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				// Material Design elevation system
				'elevation-1': 'var(--elevation-1)',
				'elevation-2': 'var(--elevation-2)',
				'elevation-3': 'var(--elevation-3)',
				'elevation-4': 'var(--elevation-4)',
				'elevation-5': 'var(--elevation-5)',
			},
			fontFamily: {
				'sans': ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				slideUp: {
					from: { transform: 'translateY(10%)' },
					to: { transform: 'translateY(0)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.6' }
				},
				cooking: {
					'0%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' },
					'100%': { transform: 'rotate(-2deg)' }
				},
				float: {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
					'100%': { transform: 'translateY(0)' }
				},
				progressPulse: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				// Material specific animations
				'material-ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'material-fade-in': {
					'0%': { opacity: '0', transform: 'translateY(4px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'material-scale': {
					'0%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'slide-up': 'slideUp 0.5s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'cooking-pot': 'cooking 2s ease-in-out infinite',
				'gift-float': 'float 3s ease-in-out infinite',
				'progress-pulse': 'progressPulse 2s ease infinite',
				// Material specific animations
				'material-ripple': 'material-ripple 0.6s linear forwards',
				'material-fade': 'material-fade-in 0.2s ease-out forwards',
				'material-scale': 'material-scale 0.15s ease-out forwards'
			},
			// Material Design spacing scale
			spacing: {
				'md-1': '8px',  // 1 unit
				'md-2': '16px', // 2 units
				'md-3': '24px', // 3 units
				'md-4': '32px', // 4 units
				'md-5': '40px', // 5 units
				'md-6': '48px', // 6 units
				'md-7': '56px', // 7 units
				'md-8': '64px', // 8 units
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
