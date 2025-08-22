import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta = {
  title: 'Shared/UI/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLinks: Story = {
  args: {
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
};

export const CustomCopyright: Story = {
  args: {
    copyright: '© 2024 My Company. All rights reserved.',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Support', href: '/support' },
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    backgroundColor: 'gray.800',
    textColor: 'white',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'API', href: '/api' },
      { label: 'GitHub', href: 'https://github.com' },
    ],
  },
};

export const MinimalStyle: Story = {
  args: {
    copyright: '© 2024 Simple App',
    backgroundColor: 'transparent',
    textColor: 'gray.500',
  },
};

export const CompanyFooter: Story = {
  args: {
    copyright: '© 2024 TechCorp Inc. Revolutionizing the future of technology.',
    backgroundColor: 'blue.50',
    textColor: 'blue.800',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Careers', href: '/careers' },
      { label: 'News', href: '/news' },
      { label: 'Investors', href: '/investors' },
    ],
  },
};