import styled, {css} from 'styled-components'

const Flex = styled.div`
  display: flex;
  ${props =>
    props.direction === 'column'
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `};

  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  ${props => props.nowrap && css`flex-wrap: nowrap;`};
  ${props => props.flex && css`flex: ${props.flex};`};
`

export default Flex
