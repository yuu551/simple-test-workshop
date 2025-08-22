import React from 'react';
import { Stack, Box, Heading, Text, Badge, Button, Header, Footer } from '@/shared/ui';
import { ContactFormWidget } from '@/widgets/contact-form-widget';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Header 
        title="Feature-Sliced Design Demo"
        subtitle="Modern Frontend Architecture with Storybook & Vitest"
        className="home-page__header"
      />
      
      <main className="home-page__main">
        <Box className="home-page__section" p={6}>
          <Stack gap={4}>
            <Heading as="h2" size="lg">お問い合わせ</Heading>
            <Stack direction="row" gap={4}>
              <Button variant="primary">プライマリボタン</Button>
              <Button variant="secondary">セカンダリボタン</Button>
            </Stack>
            <Stack direction="row" gap={4}>
              <Badge colorPalette="green">成功</Badge>
              <Badge colorPalette="red">エラー</Badge>
              <Badge colorPalette="yellow">警告</Badge>
              <Badge colorPalette="blue">情報</Badge>
            </Stack>
            <Stack direction="row" gap={4}>
              <Badge colorPalette="green">ACTIVE</Badge>
              <Badge colorPalette="gray">INACTIVE</Badge>
              <Badge colorPalette="orange">MAINTENANCE</Badge>
              <Badge colorPalette="red">UNREADY</Badge>
            </Stack>
            <ContactFormWidget />
          </Stack>
        </Box>
      </main>
      
      <Footer className="home-page__footer" />
    </div>
  );
};