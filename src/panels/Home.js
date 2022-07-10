import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Input,
  FormItem,
  Switch,
  Avatar,
  SimpleCell,
} from '@vkontakte/vkui';

const Home = ({ id, go, fetchedUser }) => {
  return (
    <Panel id={id}>
      <Group>
        <Div>
          <h1>{JSON.stringify(fetchedUser)}</h1>
        </Div>
      </Group>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  go: PropTypes.func.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};

export default Home;
