using System;
using System.Diagnostics;
using System.Text;
using System.IO;
using System.Threading;

namespace executer
{
	class Task {
		public string input;
		public string output;
		public int num;
		public Task(string input, string output, int num){
			this.input = Encoding.UTF8.GetString(Convert.FromBase64String(input));
			this.output = output;
			this.num = num + 1;
		}
	}

	class MainClass
	{
		static Process p = new Process ();
		static long startTime;
		static StreamReader sro;
		static StreamReader sre;
		static StreamWriter sw;
		static bool isWrite;
		static long totalMem;
		static long endTime;
		static string executeFileName;
		static int testsCount;
		static Task[] tests;
		static int timeLimit;
		static long memLimit;
		static string stdout;
		static string stderr;
		static string stdout64;
		static string status;
		static Thread thr;
		static long execTime;
		static string message;

		static void setTimeout(int time){
			thr = new Thread(()=>{
				Thread.Sleep(time);
				try {
					if (!p.HasExited){
						status = "timeout";
						p.Kill();
					}
				} catch (Exception e){}
			});
			thr.Start ();
		}

		static Task executeTask(Task t){
			isWrite = false;
			totalMem = 0;
			status = "";
			startTime = DateTime.Now.Ticks;
			p.Start ();
			setTimeout (timeLimit);
			sro = p.StandardOutput;
			sre = p.StandardError;
			sw = p.StandardInput;
			do {
				totalMem = Math.Max (totalMem, p.PeakWorkingSet64);
				if (totalMem > memLimit){
					try {
						if (!p.HasExited){
							status = "memory_limit";
							p.Kill();
							if (thr.IsAlive) {
								thr.Abort();
							}
						}
					} catch (Exception e){}
				}
				try {
					if (!isWrite){
						sw.Write (t.input);
						sw.Close ();
						isWrite = !isWrite;
					}
				} catch (Exception e){}
			} while (!p.HasExited);
			if (thr.IsAlive) {
				thr.Abort();
			}
			endTime = DateTime.Now.Ticks;
			execTime = (endTime - startTime) / TimeSpan.TicksPerMillisecond;
			if (p.ExitCode == 0 && status == "") {
				stdout = sro.ReadToEnd ();
				stdout64 = Convert.ToBase64String (Encoding.UTF8.GetBytes (stdout));
				if (t.output == stdout64)
					status = "ok";
				else 
					status = "wrong_answer";
				message = status;
			} else {
				if (status != "") {
					message = status;
				} else {
					stderr = sre.ReadToEnd ();
					stdout64 = Convert.ToBase64String (Encoding.UTF8.GetBytes (stderr));
					message = stdout64;
					status = "error";
				}

			}
			sro.Close ();
			sre.Close ();
			message = Convert.ToBase64String (Encoding.UTF8.GetBytes (message));
			string resultString = t.num + " " + execTime + " " + totalMem + " " + status + " " + message;
			Console.WriteLine (resultString);
			return t;
		}

		public static void Main (string[] args)
		{
			executeFileName = Environment.CurrentDirectory + "/" + Console.ReadLine(); 
			timeLimit = Convert.ToInt32(Console.ReadLine()); 
			memLimit = Convert.ToInt32(Console.ReadLine()); 
			testsCount = Convert.ToInt32(Console.ReadLine()); 
			tests = new Task[testsCount]; 
			for (int i = 0; i < testsCount; i++) {
				string input = Console.ReadLine ();
				string output = Console.ReadLine ();
				tests [i] = new Task (input, output, i);
			}
			p.StartInfo.FileName = executeFileName;
			p.StartInfo.RedirectStandardError = true;
			p.StartInfo.RedirectStandardInput= true;
			p.StartInfo.RedirectStandardOutput = true;
			p.StartInfo.UseShellExecute = false;
			p.StartInfo.WorkingDirectory = "";
            p.StartInfo.WorkingDirectory = "/home/dipom/webJudge/backend/executer/";
				
			foreach (Task t in tests) {
				executeTask (t);
				if (status != "ok")
					break;
			}
		}
	}
}
