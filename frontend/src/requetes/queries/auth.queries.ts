import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($infos: InputLogin!) {
    login(infos: $infos) {
      email
      id
      role
      token
    }
  }
`;

export const LOGOUT = gql`
  query Logout {
    logout {
      success
      message
    }
  }
`;
