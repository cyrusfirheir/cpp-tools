#include "GL/glut.h"

void display() {
	glClearColor(0.05f, 0.05f, 0.1f, 1.0f);
	glClear(GL_COLOR_BUFFER_BIT);

	glBegin(GL_TRIANGLES);
		glColor3f(1.0f, 0.0f, 0.0f); glVertex2f( 0.0f,  0.5f);
		glColor3f(0.0f, 1.0f, 0.0f); glVertex2f( 0.5f, -0.5f);
		glColor3f(0.0f, 0.0f, 1.0f); glVertex2f(-0.5f, -0.5f);
	glEnd();

	glutSwapBuffers();
}

int main(int argc, char **argv) {
	glutInit(&argc, argv);

	glutInitWindowSize(800, 600);
	glutCreateWindow("Legacy OpenGL Project");

	glutDisplayFunc(display);

	glutMainLoop();

	return 0;
}
