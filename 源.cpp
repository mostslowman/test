
#include <iostream>
#include <cmath> // ������ѧ���㣨�� pow, M_PI��

enum TableShape { RECTANGLE, CIRCLE, OVAL };

class Table {
private:
    double width;
    double length;
    double height;
    TableShape shape;

public:
    // ���캯��
    Table(double w, double l, double h, TableShape s)
        : width(w), length(l), height(h), shape(s) {
    }

    // Getter ����
    double getWidth() const { return width; }
    double getLength() const { return length; }
    double getHeight() const { return height; }
    TableShape getShape() const { return shape; }

    // �������
    double area() const {
        switch (shape) {
        case RECTANGLE:
            return width * length;
        case CIRCLE:
            return 3.14 * std::pow(width / 2, 2); // width��Ϊֱ��
        case OVAL:
            return 3.14 * (width / 2) * (length / 2); // width��length��Ϊ����
        default:
            return 0.0;
        }
    }
};

int main() {
    // ʾ���÷�
    Table rectangleTable(2.0, 3.0, 1.0, RECTANGLE);
    std::cout << "Rectangle Table Area: " << rectangleTable.area() << std::endl;

    Table circleTable(4.0, 0.0, 1.0, CIRCLE); // length��Բ��������
    std::cout << "Circle Table Area: " << circleTable.area() << std::endl;

    Table ovalTable(3.0, 5.0, 1.0, OVAL);
    std::cout << "Oval Table Area: " << ovalTable.area() << std::endl;

    return 0;
}