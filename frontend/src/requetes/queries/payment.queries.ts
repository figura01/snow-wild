import { gql } from "@apollo/client";

export const CREATE_SESSION = gql`
  query CreateSession(
    $data: [ProductForSessionInput!]!
    $reservationId: String!
  ) {
    createSession(data: $data, reservationId: $reservationId)
  }
`;
