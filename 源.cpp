
#include <iostream>
#include <cmath> // 用于数学计算（如 pow, M_PI）

enum TableShape { RECTANGLE, CIRCLE, OVAL };

class Table {
private:
    double width;
    double length;
    double height;
    TableShape shape;

public:
    // 构造函数
    Table(double w, double l, double h, TableShape s)
        : width(w), length(l), height(h), shape(s) {
    }

    // Getter 方法
    double getWidth() const { return width; }
    double getLength() const { return length; }
    double getHeight() const { return height; }
    TableShape getShape() const { return shape; }

    // 计算面积
    double area() const {
        switch (shape) {
        case RECTANGLE:
            return width * length;
        case CIRCLE:
            return 3.14 * std::pow(width / 2, 2); // width作为直径
        case OVAL:
            return 3.14 * (width / 2) * (length / 2); // width和length作为两轴
        default:
            return 0.0;
        }
    }
};

int main() {
    // 示例用法
    Table rectangleTable(2.0, 3.0, 1.0, RECTANGLE);
    std::cout << "Rectangle Table Area: " << rectangleTable.area() << std::endl;

    Table circleTable(4.0, 0.0, 1.0, CIRCLE); // length对圆形无意义
    std::cout << "Circle Table Area: " << circleTable.area() << std::endl;

    Table ovalTable(3.0, 5.0, 1.0, OVAL);
    std::cout << "Oval Table Area: " << ovalTable.area() << std::endl;

    return 0;
}