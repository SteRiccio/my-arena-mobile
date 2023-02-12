import { DataTable as RNPDataTable } from "react-native-paper";

export const DataTable = (props) => {
  const { columns, rows } = props;

  return (
    <RNPDataTable>
      <RNPDataTable.Header>
        {columns.map((column) => (
          <RNPDataTable.Title key={column.key}>
            {column.header}
          </RNPDataTable.Title>
        ))}
      </RNPDataTable.Header>
      {rows.map((row) => (
        <RNPDataTable.Row key={row.key}>
          {columns.map((column) => (
            <RNPDataTable.Cell>{row[column.key]}</RNPDataTable.Cell>
          ))}
        </RNPDataTable.Row>
      ))}
    </RNPDataTable>
  );
};
