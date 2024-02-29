import styled from 'styled-components';

export const StyledSkeletonBg = styled.div`
  ${({width}) => width ? `width: ${width}%` : 'width: 100%'};
  height: ${({height}) => height !== '100' ? (height + 'px') : '100%'};
  background-color: rgba(0, 0, 0, 0.08);
  ${({border}) => border === 'blue' && 'border: 3px solid #121026'};
  ${({borderRadius}) => borderRadius && `border-radius: ${borderRadius}px`};
  display: block;
  overflow: hidden;
  position: relative;
  &::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    animation: load 1.4s linear 0.5s infinite;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  }

  @keyframes load {
    0% {
      transform: translateX(-100%);
    }
    60% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

`;