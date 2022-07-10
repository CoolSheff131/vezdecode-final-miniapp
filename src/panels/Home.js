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
  const [authographText, setAutographText] = React.useState('');
  const [authographs, setAutographs] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [previewFileUrl, setPreviewFileUrl] = React.useState(null);

  React.useEffect(() => {
    if (file === null) {
      return setPreviewFileUrl(null);
    }
    var reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFileUrl(e.target.result);
    };

    reader.readAsDataURL(file);
  }, [file]);

  const addAutographHandle = () => {
    const authograph = { text: authographText, author: fetchedUser, imageUrl: previewFileUrl };
    setAutographs([...authographs, authograph]);
    setAutographText('');
    setFile(null);
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <Panel id={id}>
      <Group>
        <Div>
          <Div>
            <FormItem top="Название локации">
              <Input
                type="text"
                value={authographText}
                onChange={(e) => {
                  setAutographText(e.target.value);
                }}
                disabled={false}
              />
            </FormItem>
            {previewFileUrl && <img src={previewFileUrl}></img>}
            <input type="file" onChange={onFileChange} />
            <Button onClick={addAutographHandle}>Сохранить комментарии</Button>
          </Div>

          <Div>
            {authographs.map((authograph, index) => (
              <Div key={index}>
                {authograph.author && (
                  <Div>
                    {authograph.author.first_name} {authograph.author.last_name}
                  </Div>
                )}
                <div>{authograph.text}</div>
                {authograph.imageUrl && <img src={authograph.imageUrl}></img>}
              </Div>
            ))}
          </Div>
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
