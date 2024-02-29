import styled from 'styled-components';

export const StyledCalcSkeletonNavigation = styled.div`
  padding: 10px 0 15px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: minmax(10px, 73px) minmax(10px, 109px) minmax(10px, 67px) minmax(10px, 54px);
  grid-template-rows: 1fr;
`;


export const StyledCalcSkeletonContent = styled.div`
  height: 290px;
  margin-bottom: 15px;
  padding: 15px 0;
  display: grid;
  grid-gap: 5px;
  grid-template-rows: repeat(auto-fill, 1fr);
  border-top: 1px solid #1C1738;
  border-bottom: 1px solid #1C1738;
  overflow-y: auto;
  & > div:first-child {
    background-color: rgba(65, 65, 85, 0.5);
  }
`;

export const StyledCalcSkeletonUser = styled.div`
  .user-alert span {
    display: inline-flex;
    align-items: center;
  }
`;