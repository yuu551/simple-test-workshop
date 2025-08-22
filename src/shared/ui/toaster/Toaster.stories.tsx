import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toaster } from './toaster';
import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

const meta = {
  title: 'Shared/UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Default Toast',
            description: 'This is a default toast message.',
            status: 'info',
          })
        }
      >
        Show Default Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Success!',
            description: 'Your action was completed successfully.',
            status: 'success',
          })
        }
      >
        Show Success Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            status: 'error',
          })
        }
      >
        Show Error Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Warning',
            description: 'Please be aware of this important information.',
            status: 'warning',
          })
        }
      >
        Show Warning Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div>
      <Button
        onClick={() => {
          const id = toaster.create({
            title: 'Loading...',
            description: 'Processing your request.',
            type: 'loading',
            duration: 3000,
          });
          
          // Simulate completing the loading after 2 seconds
          setTimeout(() => {
            toaster.update(id, {
              title: 'Complete!',
              description: 'Your request has been processed.',
              status: 'success',
              type: 'default',
            });
          }, 2000);
        }}
      >
        Show Loading Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div>
      <Button
        onClick={() =>
          toaster.create({
            title: 'Update Available',
            description: 'A new version of the app is available.',
            status: 'info',
            action: {
              label: 'Update',
              onClick: () => alert('Updating...'),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
      <Toaster />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        onClick={() => {
          toaster.create({
            title: 'Info Toast',
            description: 'This is an informational message.',
            status: 'info',
          });
          toaster.create({
            title: 'Success Toast',
            description: 'Operation completed successfully!',
            status: 'success',
          });
          toaster.create({
            title: 'Warning Toast',
            description: 'Please pay attention to this warning.',
            status: 'warning',
          });
          toaster.create({
            title: 'Error Toast',
            description: 'An error occurred during the operation.',
            status: 'error',
          });
        }}
      >
        Show All Toast Types
      </Button>
      <Toaster />
    </div>
  ),
};