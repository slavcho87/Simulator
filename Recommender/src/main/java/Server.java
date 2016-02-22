import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.thoughtworks.xstream.XStream;
import servers.PullServer;
import utils.Configurations;
import java.util.Scanner;

public class Server {
	private static Socket socket;
	
	public Server() throws URISyntaxException, InterruptedException, IOException{
		try {
			Configurations configs = readBaseConfig();
			String url = configs.getHost()+":"+configs.getPort();

			socket = IO.socket(url);
			socket.connect();
			
			//Inicializamos un servidor de tipo pull
			PullServer pullServer = new PullServer(configs, socket);
			pullServer.run();
	    } catch (URISyntaxException e) {
	    	System.out.println(e);
	    }
	}
	
	/**
	 * Read the base configutarios
	 */
	private Configurations readBaseConfig() throws IOException{
		File archivo = new File ("./configs/baseConfig.txt");
		FileReader fr = new FileReader (archivo);

		XStream xstream = new XStream();
		xstream.alias("config", Configurations.class);
		return (Configurations) xstream.fromXML(fr);
	}
	
	/**
	 * It shows a simple menu screen
	 */
	@SuppressWarnings("resource")
	private static void menu(){
		Scanner sc = new Scanner(System.in);
		String resp = "";
		do{
			System.out.println("Insert S or s to finish: ");
			resp = sc.nextLine();
			resp = resp.toUpperCase();
		}while(!resp.equals("S"));
		socket.disconnect();
		System.exit(1);	
	}
	
	public static void main(String[] args) throws URISyntaxException, InterruptedException, IOException {
		new Server();
		menu();
	}
}
