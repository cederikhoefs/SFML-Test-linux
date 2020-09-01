#include <SFML/Window.hpp>
#include <SFML/OpenGL.hpp>

#include <SFML/Graphics/Texture.hpp>
#include <SFML/Graphics/Sprite.hpp>
#include <SFML/Graphics/RenderWindow.hpp>
#include <SFML/Graphics/Shader.hpp>
#include <SFML/Graphics/Drawable.hpp>

#include "imgui.h"
#include "imgui-SFML.h"

#include <iostream>
#include <string>

using namespace std;
using namespace sf;


typedef Vector2<double> Vector2d;

class FractalShader : public Drawable
{
private:

	Shader shader;
	Texture blanktexture;
	Sprite sprite;

public:

	int width, height;
	int iterations;
	int mode;

	float scalex, scaley;
	Vector3f viewport;
	int thickness;
	float margin;

	float variety_a;
	float functionx[16];
	float functiony[16];

public:

	FractalShader(int width0, int height0, int it0 = 100, int mode = 0, float sx0 = 10.0f, float sy0 = 10.0f, Vector3f vp = Vector3f(0, 0, 0), int th = 1.0, float mgin = 0.0001) : width(width0), height(height0), mode(mode), iterations(it0), scalex(sx0), scaley(sy0), viewport(vp), thickness(th), margin(mgin), functionx{0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, functiony{ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
	{
		cout << "Trying to load double shader..." << endl;
		if (!shader.loadFromFile("shaderdouble.frag", Shader::Fragment)) {
			cout << "Could not load double shader" << endl;
			cout << "Trying to load float shader" << endl;
			if (!shader.loadFromFile("shaderfloat.frag", Shader::Fragment)) {
				cout << "Could not load float shader" << endl;
				char x;
				cin >> x;
				exit(-1);
			}
			else
				cout << "Loaded float shader successfully" << endl;
		}
		else
			cout << "Loaded double shader successfully" << endl;

		update_textures();
		update();
		
	}

	void draw(sf::RenderTarget& target, sf::RenderStates states) const
	{
		states.shader = &shader;
		target.draw(sprite, states);

	}

	void update_textures()
	{

		blanktexture.create(width, height);
		sprite.setTexture(blanktexture);


	}

	void update()
	{

		shader.setUniform("viewport", viewport);

		shader.setUniform("screenx", width);
		shader.setUniform("screeny", height);

		shader.setUniform("scalex", scalex);
		shader.setUniform("scaley", scalex);

		shader.setUniform("thickness", thickness);
		shader.setUniform("margin", margin);

		shader.setUniform("a", variety_a);
		shader.setUniform("functionx", Glsl::Mat4(functionx));
		shader.setUniform("functiony", Glsl::Mat4(functiony));

		shader.setUniform("iterations", iterations);
		shader.setUniform("mode", mode);

	}

};


int main()
{
	cout << "Creating window..." << endl;
	RenderWindow window(VideoMode(1000, 1000), "Fraktalrenderer", Style::Titlebar | Style::Close | Style::Resize);
	window.setVerticalSyncEnabled(true);
	window.setTitle("Fraktalrender");

	window.setActive(true);

	ImGui::SFML::Init(window);

	FractalShader test(1000, 1000, 1, 0, 10.0, 10.0, Vector3f(0, 0, 0), 1, 0.0001);

	Vector2d grabstart, grabend;
	bool grabbed = false;

	sf::Clock deltaClock;

	ImGuiIO& io = ImGui::GetIO();

	while (window.isOpen()) {

		Event event;
		while (window.pollEvent(event)) {
			ImGui::SFML::ProcessEvent(event);
			switch (event.type) {

			case Event::Closed:
				window.close();
				break;

			case Event::Resized:

				break;

			case Event::MouseButtonPressed:
			{

				if (io.WantCaptureMouse)
					break;

				Vector2i m = Mouse::getPosition(window);
				Vector2d r = Vector2d(m.x / 1000.0, m.y / 1000.0);
				Vector2d v = Vector2d((r.x - 0.5) * test.scalex, (0.5 - r.y) * test.scaley);

				grabstart = Vector2d(test.viewport.x, test.viewport.y) + v;

				grabbed = true;

				break;
			}
			case Event::MouseButtonReleased:
			{
				grabbed = false;

				break;
			}

			case Event::MouseMoved:
			{

				if (io.WantCaptureMouse)
					break;
				if (Mouse::isButtonPressed(Mouse::Left) && grabbed) {
					Vector2i m = Mouse::getPosition(window);
					Vector2d r = Vector2d(m.x / 1000.0, m.y / 1000.0);
					Vector2d v = Vector2d((r.x - 0.5) * test.scalex, (0.5 - r.y) * test.scaley);

					grabend = Vector2d(test.viewport.x, test.viewport.y) + v;
					Vector2d delta = grabstart - grabend;

					test.viewport = test.viewport + Vector3f(delta.x, delta.y, 0);
					test.update();
				}
				break;
			}

			case Event::MouseWheelScrolled:
			{
				if (event.mouseWheelScroll.delta > 0) {
					test.scalex *= 0.8;
					test.scaley *= 0.8;
				}
				else {
					test.scalex /= 0.8;
					test.scaley /= 0.8;
				}
				test.update();
				break;
			}


			case Event::KeyPressed:
			{
				switch (event.key.code) {

				case Keyboard::W:
				{
					test.scalex *= 0.5;
					test.scaley *= 0.5;
					cout << "Scale: (" << test.scalex << "|" << test.scaley << ")" << endl;
					test.update();
					break;

				}

				case Keyboard::S:
				{
					test.scalex *= 2.0;
					test.scaley *= 2.0;
					test.update();
					cout << "Scale: (" << test.scalex << "|" << test.scaley << ")" << endl;
					break;

				}
				case Keyboard::Q:
				{
					test.iterations++;
					test.update();
					cout << "Iterations: " << test.iterations << endl;
					break;

				}
				case Keyboard::A:
				{
					if (test.iterations >= 1)
						test.iterations--;
					test.update();
					cout << "Iterations: " << test.iterations << endl;
					break;

				}
				case Keyboard::E:
				{
					test.viewport.z += test.scaley / test.height;
					test.update();
					cout << "z: " << test.viewport.z << endl;
					break;

				}
				case Keyboard::D:
				{
					test.viewport.z -= test.scaley / test.height;
					test.update();
					cout << "z: " << test.viewport.z << endl;
					break;

				}
				default:
					break;
				}
				break;

			}

			default:
				break;

			}

		}

		ImGui::SFML::Update(window, deltaClock.restart());

		ImGui::Begin("Parameters");

		ImGui::Text("Scale: %.5e", test.scalex);
		
		ImGui::SliderInt("k", &test.iterations, 1, 4096);
		ImGui::SliderFloat("z", &test.viewport.z, -5.0, 5.0);
		ImGui::SliderFloat("a", &test.variety_a, -4.0, 4.0);
		ImGui::SliderFloat("margin", &test.margin, 0, 0.1, "%.5f");

		ImGui::RadioButton("V(xk-a)", &test.mode, 0); 
		ImGui::RadioButton("Einfaerben", &test.mode, 1); ImGui::SameLine();
		ImGui::RadioButton("Einfaerben & V(xk-a)", &test.mode, 2); 
		ImGui::RadioButton("Konvergenzmenge", &test.mode, 3); ImGui::SameLine();
		ImGui::RadioButton("Mandelbrot", &test.mode, 4); 
		ImGui::RadioButton("Funktions-Matrix", &test.mode, 5); ImGui::SameLine();
		ImGui::RadioButton("Unterschiedliche Dicken", &test.mode, 6); ImGui::SameLine();

		ImGui::Text("X-Funktion");
		ImGui::InputFloat4("x0", &test.functionx[0]);
		ImGui::InputFloat4("x1", &test.functionx[4]);
		ImGui::InputFloat4("x2", &test.functionx[8]);
		ImGui::InputFloat4("x3", &test.functionx[12]);

		ImGui::Text("Y-Funktion");
		ImGui::InputFloat4("y0", &test.functiony[0]);
		ImGui::InputFloat4("y1", &test.functiony[4]);
		ImGui::InputFloat4("y2", &test.functiony[8]);
		ImGui::InputFloat4("y3", &test.functiony[12]);

		ImGui::End();

		test.update();
		window.clear();
		window.draw(test);

		ImGui::SFML::Render(window);

		window.display();
	}


	ImGui::SFML::Shutdown();

	return 0;
}