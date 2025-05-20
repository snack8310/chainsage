import React from 'react';
import { Box, Container, Flex } from '@radix-ui/themes';
import HeroSection from './home/HeroSection';
import CourseSearch from './home/CourseSearch';
import PopularPrograms from './home/PopularPrograms';
import UserSidebar from './home/UserSidebar';
import FeaturesSection from './home/FeaturesSection';
import CTASection from './home/CTASection';

const styles = `
  .course-card:hover {
    transform: translateY(-4px);
  }
`;

const Home: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <Container style={{ padding: '4rem 0' }}>
        <Flex gap="6">
          {/* Main Content */}
          <Box style={{ flex: 1 }}>
            <HeroSection />
            <CourseSearch />
            <PopularPrograms />
          </Box>

          {/* Sidebar */}
          <Box style={{ width: '300px' }}>
            <UserSidebar />
          </Box>
        </Flex>
      </Container>

      <FeaturesSection />
      <CTASection />
    </>
  );
};

export default Home; 