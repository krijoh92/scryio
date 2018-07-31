import styled from 'styled-components'

const px = n => (typeof n === 'number' ? `${n}px` : n)

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    max-width: ${({width = 320}) => px(width)};
  }
  @supports (grid-template-columns: 1fr 1fr) {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(${({width = 320}) => px(width)}, 1fr)
    );
    grid-gap: ${({gutter = 32}) => px(gutter)};
    > * {
      max-width: 100%;
    }
  }
`
