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
                case CIRCLE: return Math.PI * Math.pow(width / 2, 2);  // ���� width ��ֱ��
                case OVAL: return Math.PI * (width / 2) * (length / 2);  // ���� width �� length ������
                default: return 0.0;  // δ֪��״���� 0
            }
        }
        
        

}
