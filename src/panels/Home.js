import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import { Panel, Button, Group, Div, Input, FormItem } from '@vkontakte/vkui';
import { Paintable } from 'paintablejs/react';
import './styles.css';

const Home = ({ id, go, fetchedUser }) => {
  const [authographText, setAutographText] = React.useState('');
  const [authographs, setAutographs] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [previewFileUrl, setPreviewFileUrl] = React.useState(null);
  const [isCanvas, setIsCanvas] = React.useState(null);
  const [isCanvasActive, setIsCanvasActive] = React.useState(true);

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

  const handleSetFileFromBase64 = async (data) => {
    if (typeof data === 'string') {
      const base64 = await fetch(data);

      data = await base64.blob();
    }
    setFile(data);
  };

  const addAutographHandle = () => {
    const authograph = {
      text: authographText,
      author: fetchedUser,
      file,
      imageUrl: previewFileUrl,
    };
    setAutographs([...authographs, authograph]);
    setAutographText('');
    setFile(null);
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const shareInHistoryHandle = (authograph) => {
    bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      url: authograph.imageUrl,
      stickers: [
        {
          sticker_type: 'native',
          sticker: {
            action_type: 'text',
            action: {
              text: `${authograph.author.first_name} ${authograph.author.last_name} ${authograph.text}`,
            },
          },
        },
      ],
    });
  };

  return (
    <Panel id={id}>
      <Group>
        <Div>
          <Div>
            <FormItem top="Текст автографа">
              <Input
                type="text"
                value={authographText}
                onChange={(e) => {
                  setAutographText(e.target.value);
                }}
                disabled={false}
              />
            </FormItem>
            {!(isCanvas && isCanvasActive) && (
              <Button onClick={() => setIsCanvas(!isCanvas)}>
                {isCanvas ? 'Хочу загрузить изображение' : 'Хочу нарисовать автограф'}
              </Button>
            )}
            {isCanvas ? (
              <Paintable
                width={1024}
                height={768}
                color={'#fff'}
                active={isCanvasActive}
                thickness={5}
                useEraser={false}
                image={previewFileUrl}
                onSave={(image) => handleSetFileFromBase64(image)}>
                <div className={'canvas-inner'}></div>
              </Paintable>
            ) : (
              <>
                <input type="file" onChange={onFileChange} />
                {previewFileUrl && <img src={previewFileUrl}></img>}
              </>
            )}
            {isCanvas && (
              <Button onClick={() => setIsCanvasActive(!isCanvasActive)}>
                {isCanvasActive
                  ? 'Сохранить нарисованный автограф'
                  : 'Редактировать нарисованный автограф'}
              </Button>
            )}
            {!(isCanvas && isCanvasActive) && (
              <Button onClick={addAutographHandle}>Сохранить комментарии</Button>
            )}
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
                <Button onClick={() => shareInHistoryHandle(authograph)}>
                  Поделиться в истории
                </Button>
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
