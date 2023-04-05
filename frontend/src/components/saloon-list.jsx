import { useQuery, gql } from '@apollo/client';

const GET_SALOONS = gql`
  query GetSaloons {
    saloon {
      id
      name
    }
  }
`;

export function SaloonList() {
  const { loading, data } = useQuery(GET_SALOONS);

  return (
    <ul>
      {loading && <li>Loading...</li>}
      {data?.saloon?.map((saloon) => (
        <li key={saloon.name.toString()}>
          <a href={`/saloon/${saloon.id}`}>{saloon.name}</a>
        </li>
      ))}
    </ul>
  );
}
