package le;

public class Table {
public enum TableShape{RECTANGLE,CIRCLE,OVAL}	
	private
		double width;
        double length;
        double height;
        TableShape shape;
    public Table(double width, double length, double height, TableShape shape) {
        this.width = width;
        this.length = length;
        this.height = height;
        this.shape = shape;
    }
        double GetWidth() {return width;}
        double GetLength() {return length;}
        double GetHeight() {return height;}
        TableShape GetShape() {return shape;}
        double Area() {
            switch (shape) {
                case RECTANGLE: return width * length;
                case CIRCLE: return Math.PI * Math.pow(width / 2, 2);  // 假设 width 是直径
                case OVAL: return Math.PI * (width / 2) * (length / 2);  // 假设 width 和 length 是两轴
                default: return 0.0;  // 未知形状返回 0
            }
        }
        
        

}
