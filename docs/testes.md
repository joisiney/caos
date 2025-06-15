# 🧪 Testes

## 📄 Modelo de teste

```ts
const HocTemplate = (): React.JSX.Element => <Template testID="template" />;

describe('Page: <Template/>', () => {
  it('deve renderizar', async () => {
    render(<HocTemplate />);
    await act(async () => {
      const sut = screen.getByTestId('template');
      expect(sut).toBeTruthy();
    });
  });
});
``` 