import React, { useState } from 'react';
import styles from '../styles/FinancialPractice.module.css';

const FinancialPractice: React.FC = () => {
  const [requestContent, setRequestContent] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    // TODO: Implement API call to process the request
    setResult('Processing request...');
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h2>2024年全球光伏行业投研报告</h2>
        <div className={styles.instructions}>
          <h3>报告要求</h3>
          <ol>
            <li>市场分析
              <ul>
                <li>全球光伏市场规模及增长预测</li>
                <li>主要区域市场分析（中国、欧洲、北美等）</li>
                <li>产业链各环节发展状况</li>
              </ul>
            </li>
            <li>技术趋势
              <ul>
                <li>新一代光伏技术发展（TOPCon、HJT、钙钛矿等）</li>
                <li>储能技术进展及成本分析</li>
                <li>智能电网与分布式发电</li>
              </ul>
            </li>
            <li>竞争格局
              <ul>
                <li>全球主要企业市场份额</li>
                <li>产业链整合趋势</li>
                <li>新兴企业分析</li>
              </ul>
            </li>
            <li>投资机会
              <ul>
                <li>重点投资领域识别</li>
                <li>风险因素分析</li>
                <li>投资建议</li>
              </ul>
            </li>
          </ol>
          
          <h3>分析工具使用说明</h3>
          <ol>
            <li>选择分析维度（市场/技术/竞争/投资）</li>
            <li>设置分析时间范围（2024年及未来3-5年）</li>
            <li>选择数据来源（行业报告/公司财报/政策文件）</li>
            <li>指定输出格式（图表/文字/数据）</li>
          </ol>

          <h3>注意事项</h3>
          <ul>
            <li>确保数据来源的可靠性和时效性</li>
            <li>关注政策变化对行业的影响</li>
            <li>结合宏观经济环境分析</li>
            <li>考虑地缘政治因素</li>
          </ul>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.requestSection}>
          <h2>请求内容</h2>
          <div className={styles.requestForm}>
            <textarea
              value={requestContent}
              onChange={(e) => setRequestContent(e.target.value)}
              placeholder="请输入您的分析请求，例如：'请分析2024年全球光伏行业的技术发展趋势，重点关注TOPCon和HJT技术的竞争格局'"
              className={styles.textarea}
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
              生成报告
            </button>
          </div>
        </div>

        <div className={styles.resultSection}>
          <h2>分析结果</h2>
          <div className={styles.resultContainer}>
            {result || '等待请求...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPractice; 