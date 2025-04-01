export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  prerequisites?: string[];
  completed?: boolean;
}

export const courses: Course[] = [
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