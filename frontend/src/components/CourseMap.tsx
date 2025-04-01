import React, { useState } from 'react';
import { Box, Text, Card, Flex, Dialog, Button } from '@radix-ui/themes';

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  prerequisites?: string[];
  completed?: boolean;
}

const courses: Course[] = [
  {
    id: 1,
    title: '新员工入职培训',
    description: '帮助新员工快速融入公司文化和工作环境',
    level: 'beginner',
    duration: '2天',
    completed: true
  },
  {
    id: 2,
    title: '领导力基础',
    description: '培养初级管理者的基本领导技能',
    level: 'beginner',
    duration: '3天',
    prerequisites: ['新员工入职培训']
  },
  {
    id: 3,
    title: '高效沟通技巧',
    description: '提升职场沟通能力和影响力',
    level: 'intermediate',
    duration: '4天',
    prerequisites: ['领导力基础']
  },
  {
    id: 4,
    title: '项目管理实战',
    description: '掌握项目管理的核心方法和工具',
    level: 'intermediate',
    duration: '5天',
    prerequisites: ['高效沟通技巧']
  },
  {
    id: 5,
    title: '团队建设与激励',
    description: '学习如何打造高效团队并提升团队士气',
    level: 'intermediate',
    duration: '4天',
    prerequisites: ['项目管理实战']
  },
  {
    id: 6,
    title: '战略思维与决策',
    description: '培养战略思维能力和决策判断力',
    level: 'advanced',
    duration: '6天',
    prerequisites: ['团队建设与激励']
  },
  {
    id: 7,
    title: '变革管理',
    description: '掌握组织变革的方法和技巧',
    level: 'advanced',
    duration: '5天',
    prerequisites: ['战略思维与决策']
  },
  {
    id: 8,
    title: '商业谈判技巧',
    description: '提升商务谈判能力和策略思维',
    level: 'advanced',
    duration: '4天',
    prerequisites: ['变革管理']
  },
  {
    id: 9,
    title: '数字化转型领导力',
    description: '引领组织数字化转型的领导力培养',
    level: 'advanced',
    duration: '6天',
    prerequisites: ['商业谈判技巧']
  },
  {
    id: 10,
    title: '企业创新管理',
    description: '培养创新思维和创新能力',
    level: 'advanced',
    duration: '5天',
    prerequisites: ['数字化转型领导力']
  }
];

const CourseNode: React.FC<{ 
  course: Course; 
  isActive?: boolean;
  onClick: () => void;
}> = ({ course, isActive = false, onClick }) => {
  return (
    <Card 
      className="course-node"
      onClick={onClick}
      style={{
        width: '200px',
        padding: '16px',
        backgroundColor: course.completed 
          ? 'var(--green-3)' 
          : isActive 
            ? 'var(--blue-3)' 
            : 'var(--gray-1)',
        border: `2px solid ${
          course.completed 
            ? 'var(--green-6)' 
            : isActive 
              ? 'var(--blue-6)' 
              : 'var(--gray-5)'
        }`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Flex direction="column" gap="2" align="center">
        <Text size="2" weight="bold" style={{ textAlign: 'center' }}>
          {course.title}
        </Text>
        <Text size="1" color="gray">
          {course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}
        </Text>
        {course.completed && (
          <Text size="1" color="green" weight="bold">
            已完成
          </Text>
        )}
      </Flex>
    </Card>
  );
};

const CourseDetails: React.FC<{
  course: Course;
  onClose: () => void;
}> = ({ course, onClose }) => {
  return (
    <Dialog.Root>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{course.title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {course.description}
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <Box>
            <Text as="div" size="2" weight="bold" mb="1">课程信息</Text>
            <Text as="div" size="2">难度：{course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}</Text>
            <Text as="div" size="2">时长：{course.duration}</Text>
          </Box>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <Box>
              <Text as="div" size="2" weight="bold" mb="1">前置课程</Text>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>
                    <Text size="2">{prereq}</Text>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Flex gap="3" mt="4">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                关闭
              </Button>
            </Dialog.Close>
            <Button>
              开始学习
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const CourseMap: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState(0);

  // 定义路径点和控制点，创建更优雅的S形
  const pathPoints = [
    { x: 100, y: 800 },    // 起点
    { x: 300, y: 800 },    // 第一段曲线控制点1
    { x: 300, y: 600 },    // 第一段曲线控制点2
    { x: 300, y: 400 },    // 第二段曲线控制点1
    { x: 300, y: 200 },    // 第二段曲线控制点2
    { x: 700, y: 200 },    // 第三段曲线控制点1
    { x: 700, y: 400 },    // 第三段曲线控制点2
    { x: 700, y: 600 },    // 第四段曲线控制点1
    { x: 700, y: 800 },    // 第四段曲线控制点2
    { x: 900, y: 800 },    // 终点
  ];

  // 计算当前进度
  const completedCount = courses.filter(c => c.completed).length;
  const currentProgress = (completedCount / courses.length) * 100;

  // 计算贝塞尔曲线上的点
  const getBezierPoint = (t: number, p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }) => {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const oneMinusTCubed = oneMinusTSquared * oneMinusT;
    const tSquared = t * t;
    const tCubed = tSquared * t;

    return {
      x: oneMinusTCubed * p0.x +
          3 * oneMinusTSquared * t * p1.x +
          3 * oneMinusT * tSquared * p2.x +
          tCubed * p3.x,
      y: oneMinusTCubed * p0.y +
          3 * oneMinusTSquared * t * p1.y +
          3 * oneMinusT * tSquared * p2.y +
          tCubed * p3.y
    };
  };

  // 计算贝塞尔曲线上的切线
  const getBezierTangent = (t: number, p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }) => {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const tSquared = t * t;

    return {
      x: -3 * oneMinusTSquared * p0.x +
          3 * oneMinusTSquared * p1.x -
          6 * oneMinusT * t * p1.x +
          6 * oneMinusT * t * p2.x -
          3 * tSquared * p2.x +
          3 * tSquared * p3.x,
      y: -3 * oneMinusTSquared * p0.y +
          3 * oneMinusTSquared * p1.y -
          6 * oneMinusT * t * p1.y +
          6 * oneMinusT * t * p2.y -
          3 * tSquared * p2.y +
          3 * tSquared * p3.y
    };
  };

  // 计算贝塞尔曲线的总长度
  const getBezierLength = (p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }) => {
    const steps = 1000;
    let length = 0;
    let prevPoint = getBezierPoint(0, p0, p1, p2, p3);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const point = getBezierPoint(t, p0, p1, p2, p3);
      const dx = point.x - prevPoint.x;
      const dy = point.y - prevPoint.y;
      length += Math.sqrt(dx * dx + dy * dy);
      prevPoint = point;
    }

    return length;
  };

  // 根据弧长找到对应的参数t
  const getTByArcLength = (targetLength: number, p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }) => {
    const steps = 1000;
    let currentLength = 0;
    let prevPoint = getBezierPoint(0, p0, p1, p2, p3);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const point = getBezierPoint(t, p0, p1, p2, p3);
      const dx = point.x - prevPoint.x;
      const dy = point.y - prevPoint.y;
      currentLength += Math.sqrt(dx * dx + dy * dy);

      if (currentLength >= targetLength) {
        return t;
      }

      prevPoint = point;
    }

    return 1;
  };

  // 生成SVG路径（使用贝塞尔曲线）
  const generatePath = () => {
    let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    
    // 第一段曲线（左下到左上）
    path += ` C ${pathPoints[1].x} ${pathPoints[1].y} 
              ${pathPoints[2].x} ${pathPoints[2].y} 
              ${pathPoints[3].x} ${pathPoints[3].y}`;
    
    // 第二段曲线（左上到右上）
    path += ` C ${pathPoints[4].x} ${pathPoints[4].y} 
              ${pathPoints[5].x} ${pathPoints[5].y} 
              ${pathPoints[6].x} ${pathPoints[6].y}`;
    
    // 第三段曲线（右上到右下）
    path += ` C ${pathPoints[7].x} ${pathPoints[7].y} 
              ${pathPoints[8].x} ${pathPoints[8].y} 
              ${pathPoints[9].x} ${pathPoints[9].y}`;
    
    return path;
  };

  // 计算课程节点位置
  const coursePositions = courses.map((_, index) => {
    const t = index / (courses.length - 1);
    
    // 根据进度计算在路径上的位置
    if (t < 0.25) {
      // 第一段曲线（左下到左上）
      const segmentT = t * 4;
      const p0 = { x: 100, y: 800 };
      const p1 = { x: 300, y: 800 };
      const p2 = { x: 300, y: 600 };
      const p3 = { x: 300, y: 400 };
      const length = getBezierLength(p0, p1, p2, p3);
      const targetLength = length * segmentT;
      const finalT = getTByArcLength(targetLength, p0, p1, p2, p3);
      return getBezierPoint(finalT, p0, p1, p2, p3);
    } else if (t < 0.5) {
      // 第二段曲线（左上到右上）
      const segmentT = (t - 0.25) * 4;
      const p0 = { x: 300, y: 400 };
      const p1 = { x: 300, y: 200 };
      const p2 = { x: 700, y: 200 };
      const p3 = { x: 700, y: 200 };
      const length = getBezierLength(p0, p1, p2, p3);
      const targetLength = length * segmentT;
      const finalT = getTByArcLength(targetLength, p0, p1, p2, p3);
      return getBezierPoint(finalT, p0, p1, p2, p3);
    } else if (t < 0.75) {
      // 第三段曲线（右上到右下）
      const segmentT = (t - 0.5) * 4;
      const p0 = { x: 700, y: 200 };
      const p1 = { x: 700, y: 400 };
      const p2 = { x: 700, y: 600 };
      const p3 = { x: 700, y: 800 };
      const length = getBezierLength(p0, p1, p2, p3);
      const targetLength = length * segmentT;
      const finalT = getTByArcLength(targetLength, p0, p1, p2, p3);
      return getBezierPoint(finalT, p0, p1, p2, p3);
    } else {
      // 第四段曲线（右下到右下）
      const segmentT = (t - 0.75) * 4;
      const p0 = { x: 700, y: 800 };
      const p1 = { x: 750, y: 800 };  // 调整控制点1
      const p2 = { x: 825, y: 800 };  // 调整控制点2
      const p3 = { x: 900, y: 800 };
      const length = getBezierLength(p0, p1, p2, p3);
      const targetLength = length * segmentT;
      const finalT = getTByArcLength(targetLength, p0, p1, p2, p3);
      return getBezierPoint(finalT, p0, p1, p2, p3);
    }
  });

  return (
    <Box style={{
      height: '100vh',
      padding: '40px',
      backgroundColor: 'var(--gray-1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          .course-node:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .progress-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: progress 2s ease forwards;
          }
          @keyframes progress {
            to {
              stroke-dashoffset: ${1000 - (currentProgress * 10)};
            }
          }
          .path-shadow {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          .svg-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
          }
          .svg-path {
            stroke-linecap: round;
            stroke-linejoin: round;
          }
        `}
      </style>

      {/* 背景路径 */}
      <svg
        className="svg-container"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {/* 路径阴影 */}
        <path
          className="path-shadow svg-path"
          d={generatePath()}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="20"
          fill="none"
        />
        
        {/* 主路径 */}
        <path
          className="svg-path"
          d={generatePath()}
          stroke="var(--gray-6)"
          strokeWidth="10"
          fill="none"
          strokeDasharray="20,10"
        />
        
        {/* 进度路径 */}
        <path
          className="progress-path svg-path"
          d={generatePath()}
          stroke="var(--green-6)"
          strokeWidth="10"
          fill="none"
          strokeDasharray="20,10"
        />
      </svg>

      {/* 课程节点 */}
      <Box style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1
      }}>
        {courses.map((course, index) => (
          <Box
            key={course.id}
            style={{
              position: 'absolute',
              left: `${coursePositions[index].x / 10}%`,
              top: `${coursePositions[index].y / 10}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <CourseNode 
              course={course} 
              isActive={index === completedCount}
              onClick={() => setSelectedCourse(course)}
            />
          </Box>
        ))}
      </Box>

      {/* 课程详情弹窗 */}
      {selectedCourse && (
        <CourseDetails 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </Box>
  );
};

export default CourseMap; 