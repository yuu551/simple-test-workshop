import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './alert';

const meta = {
  title: 'Shared/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'warning', 'success', 'error'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'info',
    title: 'Information',
    children: 'This is an informational alert message.',
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Success',
    children: 'Your action was completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Warning',
    children: 'Please be aware of this important information.',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Error',
    children: 'An error occurred while processing your request.',
  },
};

export const WithoutDescription: Story = {
  args: {
    status: 'info',
    title: 'Simple alert without description',
  },
};

export const AllStatuses: Story = {
  args: {
    status: 'success',
    title: 'Alert',
    children: 'Alert message',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Alert status="info" title="Information">
        This is an informational alert message.
      </Alert>
      <Alert status="success" title="Success">
        Your action was completed successfully.
      </Alert>
      <Alert status="warning" title="Warning">
        Please be aware of this important information.
      </Alert>
      <Alert status="error" title="Error">
        An error occurred while processing your request.
      </Alert>
    </div>
  ),
};