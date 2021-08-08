import { Box } from "grommet";
import styled, { css } from "styled-components";

const infiniteScrollStyle = css`
   & tr:last-child{
      display:none;
   }
`;

export interface StyledDataTableProps {
  isInfiniteScroll: boolean;
}

const StyledDataTable = styled(Box)<StyledDataTableProps>`
  ${({ isInfiniteScroll }) => isInfiniteScroll && infiniteScrollStyle}
`;

export default StyledDataTable;
