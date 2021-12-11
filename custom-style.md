# Add your custom Theme
Adding your own theme to wikifox is just simple as blinking your eyes. Follow the below step to acheive it!

- Click the `options` button on the wikifox homepage
- Under `Appearence`, Choose `Custom CSS`
- Add the link to your hosted css file after creating it (see below)
- Thats all you got it!

# Template
Modify this template according to your color sense!

```css
:root{

    /* Theme Colors */
    --button: #181818;
    --highlight: #0070f3;
    --background: #ffffff;
    --secondary-background: #f0f0f08e;
    --hairline: #d1dbe0;

    /* Font Colors */
    --primary-color: rgb(48, 48, 48);
    --secondary-color: #6c757d;
    --tertiary-color: #365463;

    /* Misc */
    --box-shadow-prime: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    --box-shadow-light: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
}
```
# Explaination
| Variable               | Description                                                 |
|------------------------|-------------------------------------------------------------|
| --button               | The color of the buttons in the page                        |
| --highlight            | Some elements may highlight on hover, This may come in use! |
| --background           | Primary background of the page                              |
| --secondary-background | Secondary elements, eg a search bar                         |
| --hairline             |  Border colors                                              |
| --primary-color        | Primary colors - Headings                                   |
| --secondary-color      | Sub headings and content                                    |
| --tertiary-color       |  Rarely used in some parts (font color)                     |
| --box-shadow-prime     | Primary box shadow                                          |
| --box-shadow-light     | Secondary box-shadow                                        |


